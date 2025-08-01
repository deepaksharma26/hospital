import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateFinancialYear, fetchFinancialYear } from '../redux/financialYearSlice';

const FinancialYear = () => {
  const dispatch = useDispatch();
  const { financialYears, loading, error } = useSelector((state) => state.financialYear);
   const [form, setForm] = useState({ 
    description: '',
    name: '',
    startDate: '',
    endDate: '', 
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchFinancialYear());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch add or update action here
    const data = {
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };
    dispatch(addOrUpdateFinancialYear(data));
    setForm({ description: '', name: '', startDate: '', endDate: '' });
    setIsEdit(false);
  };

  const handleEdit = (row) => {
    setForm(row);
    setIsEdit(true);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? 'Edit Financial Year' : 'Add Financial Year'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Year"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                {isEdit ? 'Update' : 'Add'}
              </Button>
              {isEdit && (
                <Button
                  variant="outlined"
                  sx={{ ml: 2 }}
                  onClick={() => {
                    setForm({ name: '', description:'', startDate: '', endDate: '' });
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Financial Years
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialYears && financialYears.map((row,index) => (
                  <TableRow key={index}>
                    <TableCell>{row?.name}</TableCell>
                    <TableCell>{row?.description}</TableCell>
                    <TableCell>{row?.startDate}</TableCell> 
                    <TableCell>{row?.endDate}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </Button>
                      {/* Add Delete button if needed */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default FinancialYear;