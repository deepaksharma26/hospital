import React from 'react';
import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

// Sample data for charts and table
const barData = [
  { name: 'Jan', patients: 40 },
  { name: 'Feb', patients: 30 },
  { name: 'Mar', patients: 20 },
  { name: 'Apr', patients: 27 },
  { name: 'May', patients: 18 },
  { name: 'Jun', patients: 23 },
];

const pieData = [
  { name: 'Male', value: 60 },
  { name: 'Female', value: 40 },
];

const COLORS = ['#1976d2', '#e57373'];

const tableRows = [
  { id: 1, name: 'John Doe', age: 32, status: 'Checked In' },
  { id: 2, name: 'Jane Smith', age: 28, status: 'Checked Out' },
  { id: 3, name: 'Sam Wilson', age: 45, status: 'Checked In' },
  { id: 4, name: 'Lisa Ray', age: 36, status: 'Checked Out' },
];

const Home = () => (
  <Box sx={{ p: { xs: 1, sm: 3 } }}>
    <Typography variant="h4" gutterBottom>
      Dashboard Overview
    </Typography>
    <Grid container spacing={3}>
      {/* Bar Chart */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: 320 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Patients
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="patients" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      {/* Pie Chart */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Gender Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      {/* Table */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Patients
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default Home;