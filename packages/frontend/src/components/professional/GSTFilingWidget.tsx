import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { Assignment, Refresh } from '@mui/icons-material';
import { professionalService } from '../../services/professionalService';

interface GSTFilingWidgetProps {
  selectedTenant: string | 'all';
}

export const GSTFilingWidget: React.FC<GSTFilingWidgetProps> = ({ selectedTenant }) => {
  const [gstFilings, setGstFilings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadGSTFilings = async () => {
    try {
      setLoading(true);
      const data = await professionalService.getGSTFilings(selectedTenant);
      setGstFilings(data);
    } catch (error) {
      console.error('Error loading GST filings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGSTFilings();
  }, [selectedTenant]);

  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">GST Filing Overview</Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadGSTFilings}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : gstFilings.length === 0 ? (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            No GST filings found for the selected tenant.
          </Typography>
        ) : (
          <List sx={{ mt: 2 }}>
            {gstFilings.map((filing) => (
              <ListItem key={filing.id}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <ListItemText
                  primary={`${filing.type} - ${filing.period}`}
                  secondary={`Status: ${filing.status} | Filed on: ${filing.filedOn || 'Pending'}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
