import React, { useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button
} from '@mui/material';

const BillPrint = ({ bill, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=900,width=800');
    win.document.write('<html><head><title>Print Bill</title>');
    win.document.write('<style>');
    win.document.write(`
      @page {
        size: A4;
        margin: 24mm 12mm 24mm 12mm;
      }
      body { 
        font-family: 'Roboto', Arial, sans-serif; 
        margin: 0; 
        background: #f5f7fa; 
      }
      .bill-paper { 
        margin: 0 auto; 
        background: #fff; 
        border-radius: 12px; 
        box-shadow: 0 4px 24px #0001; 
        padding: 32px 40px; 
        width: 210mm; 
        min-height: 297mm;
        box-sizing: border-box;
      }
      .bill-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 24px; 
      }
      .bill-title { 
        font-size: 2.2rem; 
        font-weight: bold; 
        color: #185a9d; 
        letter-spacing: 2px;
      }
      .bill-info { 
        font-size: 1.05rem; 
        color: #333; 
      }
      .bill-table th { 
        background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%); 
        color: #fff; 
        font-weight: 700; 
        font-size: 1rem;
      }
      .bill-table td, .bill-table th { 
        padding: 8px 12px; 
        font-size: 1rem; 
        border-bottom: 1px solid #e0e0e0;
      }
      .bill-summary { 
        margin-top: 24px; 
        font-size: 1.1rem; 
      }
      .bill-footer { 
        margin-top: 32px; 
        text-align: right; 
        color: #888; 
      }
      .bill-company {
        font-size: 1.1rem;
        color: #185a9d;
        font-weight: bold;
        margin-bottom: 4px;
      }
      .bill-contact {
        font-size: 1rem;
        color: #444;
      }
      @media print {
        .no-print { display: none; }
        .bill-paper { 
          box-shadow: none; 
          border-radius: 0; 
          width: 100%; 
          min-height: initial;
          padding: 0;
        }
        body { background: #fff; }
      }
    `);
    win.document.write('</style>');
    win.document.write('</head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  if (!bill) return null;

  return (
    <Box>
      <Box ref={printRef}>
        <Paper className="bill-paper" elevation={6}>
          {/* Header */}
          <Box className="bill-header">
            <Box>
              <Typography className="bill-title">INVOICE</Typography>
              <Typography className="bill-info" sx={{ mt: 1 }}>
                <b>Invoice No:</b> {bill.invoiceNumber || bill._id}<br />
                <b>Date:</b> {bill.invoiceDate ? new Date(bill.invoiceDate).toLocaleDateString() : ''}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography className="bill-company">
                Company Name Pvt. Ltd.
              </Typography>
              <Typography className="bill-contact">
                123, Main Street, City, State, 123456<br />
                GSTIN: 22AAAAA0000A1Z5<br />
                Phone: 99999 99999
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {/* Customer Info */}
          <Box sx={{ mb: 2 }}>
            <Typography className="bill-info">
              <b>Billed To:</b> {bill.customerName}<br />
              <b>Address:</b> {bill.customerAddress}<br />
              <b>Contact:</b> {bill.customerPhone}
            </Typography>
          </Box>
          {/* Table */}
          <TableContainer>
            <Table className="bill-table">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Tax %</TableCell>
                  <TableCell align="right">Tax</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bill.billingDetails && bill.billingDetails.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">₹{Number(item.unitPrice).toFixed(2)}</TableCell>
                    <TableCell align="right">{item.taxPercent || '-'}</TableCell>
                    <TableCell align="right">₹{Number(item.tax || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">₹{Number(item.discount || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">₹{Number(item.totalPrice || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Summary */}
          <Box className="bill-summary" sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
              <Box>
                <Typography><b>Subtotal:</b></Typography>
                <Typography><b>Total Tax:</b></Typography>
                <Typography><b>Total Discount:</b></Typography>
                <Typography variant="h6" sx={{ mt: 1, color: '#185a9d' }}><b>Grand Total:</b></Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography>₹{Number(bill.totalAmount || 0).toFixed(2)}</Typography>
                <Typography>₹{Number(bill.taxAmount || 0).toFixed(2)}</Typography>
                <Typography>₹{Number(bill.discountAmount || 0).toFixed(2)}</Typography>
                <Typography variant="h6" sx={{ mt: 1, color: '#185a9d' }}>
                  ₹{Number(bill.finalAmount || bill.totalAmount || 0).toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <Typography sx={{ fontStyle: 'italic', color: '#888', mt: 1 }}>
              Payment Method: {bill.paymentMethodDetails || '-'}
            </Typography>
            {bill.customerNotes && (
              <Typography sx={{ mt: 1, color: '#888' }}>
                <b>Note:</b> {bill.customerNotes}
              </Typography>
            )}
          </Box>
          {/* Footer */}
          <Box className="bill-footer">
            <Typography variant="body2">
              Thank you for your business!
            </Typography>
          </Box>
        </Paper>
      </Box>
      {/* Print/Close Buttons */}
      <Box className="no-print" sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Bill
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Close Preview
        </Button>
      </Box>
    </Box>
  );
};

export default BillPrint;