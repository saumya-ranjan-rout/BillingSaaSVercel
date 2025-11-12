'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, TextField, Button, IconButton,
  Menu, FormControl, InputLabel, Select, Grid, Typography,MenuItem
} from '@mui/material';
import { FilterList, GetApp, Edit, Block, CheckCircle } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useApi } from '../../hooks/useApi'; // Import useApi
import { toast } from 'sonner';

interface DataTableProps {
  title: string;
  resource: 'users' | 'tenants' | 'professionals' | 'auditLogs' | 'subscriptions';
  columns: { id: string; label: string; format?: (value: any) => any }[];
  data?: any[];
  onView?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onStatusChange?: (id: string | number, status: boolean) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  title, resource, columns = [], data = [],
  onEdit, onStatusChange
}) => {
  const [page, setPage] = useState(0), [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<any>({});
  const [filteredData, setFilteredData] = useState<any[]>(data);
    const { getBlob, error } = useApi<Blob>();

  useEffect(() => {
    let filtered = [...data];

    console.log('Filters:', filters);
    // if (filters.search)
    //   filtered = filtered.filter(row =>
    //     Object.values(row).some(val =>
    //       String(val).toLowerCase().includes(filters.search.toLowerCase())
    //     )
    //   );

    if (filters.search) {
  const searchTerm = filters.search.toLowerCase();

  filtered = filtered.filter(row => {
    // Check top-level fields
    const topLevelMatch = Object.values(row).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(searchTerm)
    );

    // Check nested tenant name (if present)
    const tenantMatch = row.tenant?.name?.toLowerCase().includes(searchTerm);

    return topLevelMatch || tenantMatch;
  });
}

    if (filters.status)
      filtered = filtered.filter(row =>
    resource === 'users' ?
     row.status === 'active' ? filters.status === 'active' : filters.status === 'inactive'
      :
        row.isActive ? filters.status === 'active' : filters.status === 'inactive'
      );
    if (filters.startDate)
      filtered = filtered.filter(r => new Date(r.createdAt || r.timestamp) >= new Date(filters.startDate));
    if (filters.endDate)
      filtered = filtered.filter(r => new Date(r.createdAt || r.timestamp) <= new Date(filters.endDate));
    setFilteredData(filtered);
  }, [filters, data]);

  // const handleDownload = async () => {
  //   try {
  //     const blob = await getBlob(`/api/super-admin/export/${resource}/csv`);
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${resource}.csv`;
  //     a.click();
  //   } catch (err) {
  //     alert('Download failed');
  //   }
  // };


  const handleDownload = async () => {
  try {
    // Filter out the action column(s) from columns
    const visibleColumns = columns.filter((col) => col.id !== 'actions');

    // Prepare the data to be exported, excluding the action column
    const exportData = filteredData.map((row) => {
      const filteredRow: any = {};
      visibleColumns.forEach((col) => {
        if (col.id === 'tenant') {
          // Format tenant to show the tenant name, not the object
          filteredRow[col.id] = row.tenant?.name || '-';
        } else if (col.id === 'isActive') {
          // Format 'isActive' field to 'Active' or 'Inactive'
          filteredRow[col.id] = row[col.id] ? 'Active' : 'Inactive';
        } else {
          filteredRow[col.id] = row[col.id];
        }
      });
      return filteredRow;
    });

    // Convert the data to CSV format
    const csvContent = convertToCSV(exportData, visibleColumns);

    // Trigger the CSV download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource}.csv`;
    a.click();
  } catch (err) {
    alert('Download failed');
  }
};

// Helper function to convert data to CSV format
const convertToCSV = (data: any[], columns: any[]) => {
  const header = columns.map((col) => col.label).join(','); // Get column labels
  const rows = data.map((row) =>
    columns.map((col) => (row[col.id] ? `"${row[col.id]}"` : '')).join(',')
  );
  return [header, ...rows].join('\n');
};

  const paginated = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={600}>{title}</Typography>
          <Box>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)}><FilterList /></IconButton>
            {/* <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} PaperProps={{ sx: { p: 2, width: 300 } }}> */}

            <Menu
  anchorEl={anchor}
  open={!!anchor}
  onClose={() => setAnchor(null)}
  PaperProps={{ sx: { p: 2, width: 300 } }}
  disableAutoFocusItem
  autoFocus={false}
>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {/* <TextField fullWidth label="Search" value={filters.search || ''} onChange={e => setFilters({ ...filters, search: e.target.value })} /> */}
                  {/* <TextField
        fullWidth
        label="Search"
        value={filters.search || ''}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        variant="outlined" // You can use variant="outlined" for a more professional look
        size="small" // Small size to keep inputs compact
      /> */}

      <TextField
        fullWidth
        label="Search"
        value={filters.search || ''}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        variant="outlined"
        size="small"
        onKeyDown={(e) => e.stopPropagation()} // ← ADD THIS
      />

    
       </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    {/* <Select value={filters.status || ''} label="Status"
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                      <option value="">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select> */}

                            <Select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          label="Status"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
                  </FormControl>
                </Grid>
                {['startDate', 'endDate'].map(k => (
                  <Grid item xs={12} key={k}>
                    <DatePicker
                      label={k === 'startDate' ? 'Start Date' : 'End Date'}
                      value={filters[k] || null}
                      onChange={(d) => setFilters({ ...filters, [k]: d })}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button fullWidth variant="outlined" onClick={() => setFilters({})}>Clear Filters</Button>
                </Grid>
              </Grid>
            </Menu>
            <IconButton onClick={handleDownload}><GetApp /></IconButton>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          {filteredData.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>No records found</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map(col => <TableCell key={col.id}>{col.label}</TableCell>)}
                {resource !== 'auditLogs' && resource !== 'subscriptions' && <TableCell>Actions</TableCell>}

                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map(col => (
                      <TableCell key={col.id}>{col.format ? col.format(row) : row[col.id]}</TableCell>
                    ))}
                    {resource !== 'auditLogs' && resource !== 'subscriptions' && (
                      <TableCell>
                        <IconButton size="small" onClick={() => onEdit?.(row.id)}><Edit /></IconButton>

                              
{resource !== 'users' ? (
            <IconButton
              size="small"
              onClick={() => onStatusChange?.(row.id, !row.isActive)}
              color={row.isActive ? 'secondary' : 'success'}
            >
              {row.isActive ? <Block /> : <CheckCircle />}
            </IconButton>
          ) : (
            <IconButton
              size="small"
              onClick={() => onStatusChange?.(row.id, row.status !== 'active')}
              color={row.status === 'active' ? 'secondary' : 'success'}
            >
              {row.status === 'active' ? <Block /> : <CheckCircle />}
            </IconButton>
          )}

                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, n) => setPage(n)}
          onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </CardContent>
    </Card>
  );
};
