import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Divider
} from '@mui/material';
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
    setForm({
      name: row.name,
      description: row.description,
      startDate: row.startDate?.slice(0, 10) || '',
      endDate: row.endDate?.slice(0, 10) || '',
    });
    setIsEdit(true);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, background: '#f8fafc', minHeight: '100vh' }}>
      {/* Form Section */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
          color: '#fff',
          boxShadow: 6,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            letterSpacing: 1,
            mb: 2,
            textShadow: '0 2px 8px #185a9d44',
          }}
        >
          {isEdit ? 'Edit Financial Year' : 'Add Financial Year'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Year"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{
                  style: { background: '#fff', borderRadius: 8 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{
                  style: { background: '#fff', borderRadius: 8 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  style: { background: '#fff', borderRadius: 8 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  style: { background: '#fff', borderRadius: 8 }
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
                  color: '#fff',
                  boxShadow: 2,
                  px: 4,
                  mr: 2,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #ff5e62 0%, #ff9966 100%)',
                  },
                }}
              >
                {isEdit ? 'Update' : 'Add'}
              </Button>
              {isEdit && (
                <Button
                  variant="outlined"
                  sx={{
                    ml: 2,
                    color: '#fff',
                    borderColor: '#fff',
                    '&:hover': {
                      background: '#fff',
                      color: '#185a9d',
                      borderColor: '#185a9d',
                    },
                  }}
                  onClick={() => {
                    setForm({ name: '', description: '', startDate: '', endDate: '' });
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

      {/* Divider */}
      <Divider sx={{ mb: 4, borderColor: 'rgba(67,206,162,0.2)' }} />

      {/* Table Section */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 1, sm: 3 },
          borderRadius: 3,
          boxShadow: 2,
          background: '#fff',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            mb: 2,
            color: '#185a9d',
            letterSpacing: 1,
          }}
        >
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
                <TableRow sx={{ background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Year</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Details</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Start Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>End Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialYears && financialYears.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{row?.name}</TableCell>
                    <TableCell>{row?.description}</TableCell>
                    <TableCell>{row?.startDate?.slice(0, 10)}</TableCell>
                    <TableCell>{row?.endDate?.slice(0, 10)}</TableCell>
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