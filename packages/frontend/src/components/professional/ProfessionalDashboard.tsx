import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  Chip,
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AccountBalance,
  Assignment,
  Receipt,
  CalendarToday,
  TrendingUp,
  Business
} from '@mui/icons-material';
import { ProfessionalTenantSwitcher } from './ProfessionalTenantSwitcher';
import { GSTFilingWidget } from './GSTFilingWidget';
import { professionalService } from '../../services/professionalService';

interface DashboardData {
  tenants: any[];
  complianceData: any[];
  recentActivities: any[];
  financialSummary: any;
}

export const ProfessionalDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<string | 'all'>('all');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedTenant]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await professionalService.getProfessionalDashboard(selectedTenant);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantChange = (tenantId: string | 'all') => {
    setSelectedTenant(tenantId);
  };

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Professional Dashboard</Typography>
        <ProfessionalTenantSwitcher
          tenants={dashboardData?.tenants || []}
          selectedTenant={selectedTenant}
          onTenantChange={handleTenantChange}
        />
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="GST Filing" />
        <Tab label="Compliance" />
        <Tab label="Reports" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Compliance Dates
                </Typography>
                <List>
                  {dashboardData?.complianceData.slice(0, 5).map((item) => (
                    <ListItem key={item.id}>
                      <ListItemIcon>
                        <CalendarToday color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={`Due: ${new Date(item.dueDate).toLocaleDateString()} - ${item.tenantName}`}
                      />
                      <Chip
                        label={item.status}
                        color={item.status === 'due' ? 'error' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {dashboardData?.recentActivities.slice(0, 5).map((activity) => (
                    <ListItem key={activity.id}>
                      <ListItemIcon>
                        {activity.type === 'filing' && <Assignment color="info" />}
                        {activity.type === 'invoice' && <Receipt color="success" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.description}
                        secondary={`${new Date(activity.timestamp).toLocaleString()} - ${activity.tenantName}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Financial Summary
                </Typography>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ₹{dashboardData?.financialSummary?.totalRevenue?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Revenue ({selectedTenant === 'all' ? 'All Tenants' : 'This Tenant'})
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="contained" startIcon={<Assignment />}>
                    File GSTR-1
                  </Button>
                  <Button variant="contained" startIcon={<Assignment />}>
                    File GSTR-3B
                  </Button>
                  <Button variant="outlined" startIcon={<Receipt />}>
                    View All Invoices
                  </Button>
                  <Button variant="outlined" startIcon={<Business />}>
                    Manage Tenants
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <GSTFilingWidget selectedTenant={selectedTenant} />
      )}
    </Box>
  );
};
