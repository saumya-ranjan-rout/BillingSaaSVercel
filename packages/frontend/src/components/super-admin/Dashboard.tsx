import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  People,
  Business,
  AccountBalance,
  Receipt
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useApi } from "../../hooks/useApi";
import Link from "next/link";

interface DashboardData {
  totalRevenue: number;
  totalCustomers: number;
  totalInvoices: number;
  totalUsers: number;
  totalTenants: number;
  totalProfessionals: number;
  activeSubscriptions: number;
  revenueData: { month: string; revenue: number }[];
  systemHealth: {
    database: { status: string; message: string };
    storage: { status: string; message: string; usage: string };
    api: { status: string; message: string; responseTime: number };
  };
  recentSignups: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    isActive: boolean;
  }[];
}

export const SuperAdminDashboard: React.FC = () => {
  const { data, loading, error, get } = useApi<DashboardData>();
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchDashboardData = async () => {
    
    try {
    
      await get("/api/super-admin/dashboard");
      console.log("Dashboard data:", data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
    
      console.error("Error fetching super admin dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Typography
        sx={{
          textAlign: "center",
          mt: 10,
          fontSize: "1.2rem",
          color: "text.secondary",
        }}
      >
        Loading Super Admin Dashboard...
      </Typography>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="error" variant="h6" gutterBottom>
          Error Loading Super Admin Dashboard
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {error}
        </Typography>
        <button
          onClick={fetchDashboardData}
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Refresh
        </button>
      </Box>
    );
  }

  const dashboardData: DashboardData = data || {
    totalRevenue: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    totalUsers: 0,
    totalTenants: 0,
    totalProfessionals: 0,
    activeSubscriptions: 0,
    revenueData: [],
    systemHealth: {
      database: { status: "", message: "" },
      storage: { status: "", message: "", usage: "" },
      api: { status: "", message: "", responseTime: 0 },
    },
    recentSignups: [],
  };

  return (
    <Box sx={{ mt: 2, p: 3 }}>
      {/* ===== Header ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Super Admin Dashboard
          </Typography>
          {lastUpdated && (
            <Typography variant="body2" color="textSecondary">
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Box>
        <button
          onClick={fetchDashboardData}
          style={{
            backgroundColor: "#e0e0e0",
            color: "#333",
            padding: "8px 14px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Refresh
        </button>
      </Box>

      {/* ===== Cards Section ===== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            icon: <People color="primary" sx={{ fontSize: 40 }} />,
            title: "Total Users",
            value: dashboardData.totalUsers,
          },
          {
            icon: <Business color="secondary" sx={{ fontSize: 40 }} />,
            title: "Total Tenants",
            value: dashboardData.totalTenants,
          },
          {
            icon: <AccountBalance color="success" sx={{ fontSize: 40 }} />,
            title: "Professionals",
            value: dashboardData.totalProfessionals,
          },
          {
            icon: <Receipt color="warning" sx={{ fontSize: 40 }} />,
            title: "Active Subscriptions",
            value: dashboardData.activeSubscriptions,
          },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card>
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                {item.icon}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" fontWeight={600}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===== Revenue + System Health Section ===== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Trend (Last 12 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1976d2"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              {Object.entries(dashboardData.systemHealth).map(([key, data]) => (
                <Box key={key} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" textTransform="capitalize">
                      {key}
                    </Typography>
                    <Chip
                      label={data.status}
                      color={data.status === "healthy" ? "success" : "error"}
                      size="small"
                    />
                  </Box>
                 <Typography variant="body2" color="textSecondary">
{data && typeof data === "object" ? (
  <>
    {data.message}
  </>
) : (
  String(data)
)}

</Typography>

                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ===== Recent Signups Table ===== */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Signups
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Signup Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentSignups.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={user.isActive ? "success" : "default"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};
