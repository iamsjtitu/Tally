import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowLeft, Printer, Download } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8765/api';

const CashBook = ({ company }) => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchCashBook();
  }, [company, fromDate, toDate]);

  const fetchCashBook = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/cash-book?companyId=${company.id}&fromDate=${fromDate}&toDate=${toDate}`);
      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching cash book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cash book...</div>;
  }

  if (!company) {
    return (
      <div className="loading">
        Please select a company first
        <button className="btn btn-primary" onClick={() => navigate('/companies')} style={{ marginLeft: '20px' }}>
          Select Company
        </button>
      </div>
    );
  }

  const receipts = vouchers.filter(v => v.type === 'Receipt');
  const payments = vouchers.filter(v => v.type === 'Payment');
  
  const totalReceipts = receipts.reduce((sum, v) => {
    const voucherTotal = v.entries.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    return sum + voucherTotal;
  }, 0) / 2;

  const totalPayments = payments.reduce((sum, v) => {
    const voucherTotal = v.entries.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    return sum + voucherTotal;
  }, 0) / 2;

  const balance = totalReceipts - totalPayments;

  return (
    <div>
      <div className="tally-header">
        <h1>💵 Cash Book - {company.name}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary">
            <Printer size={18} />
            Print
          </button>
          <button className="btn btn-secondary">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            <ArrowLeft size={18} />
            Back to Reports
          </button>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontWeight: '600' }}>From:</label>
            <input 
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <label style={{ fontWeight: '600' }}>To:</label>
            <input 
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div className="card" style={{ background: '#d4edda', borderColor: '#28a745' }}>
            <div style={{ fontSize: '14px', color: '#155724', marginBottom: '5px' }}>Total Receipts</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
              ₹ {totalReceipts.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: '#155724', marginTop: '5px' }}>{receipts.length} transactions</div>
          </div>

          <div className="card" style={{ background: '#f8d7da', borderColor: '#dc3545' }}>
            <div style={{ fontSize: '14px', color: '#721c24', marginBottom: '5px' }}>Total Payments</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>
              ₹ {totalPayments.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: '#721c24', marginTop: '5px' }}>{payments.length} transactions</div>
          </div>

          <div className="card" style={{ background: balance >= 0 ? '#d4edda' : '#fff3cd', borderColor: balance >= 0 ? '#28a745' : '#ffc107' }}>
            <div style={{ fontSize: '14px', color: balance >= 0 ? '#155724' : '#856404', marginBottom: '5px' }}>Balance</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: balance >= 0 ? '#28a745' : '#ff9800' }}>
              ₹ {Math.abs(balance).toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: balance >= 0 ? '#155724' : '#856404', marginTop: '5px' }}>
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #003d7a', paddingBottom: '15px' }}>
            <h2 style={{ fontSize: '24px', color: '#003d7a', marginBottom: '5px' }}>{company.name}</h2>
            <h3 style={{ fontSize: '18px', color: '#666' }}>Cash Book</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {new Date(fromDate).toLocaleDateString()} to {new Date(toDate).toLocaleDateString()}
            </p>
          </div>

          {vouchers.length > 0 ? (
            <table className="tally-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Voucher No</th>
                  <th>Type</th>
                  <th>Particulars</th>
                  <th className="amount">Receipts (₹)</th>
                  <th className="amount">Payments (₹)</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => {
                  const voucherTotal = voucher.entries.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) / 2;
                  return (
                    <tr key={voucher.id}>
                      <td>{new Date(voucher.date).toLocaleDateString()}</td>
                      <td>{voucher.voucherNumber}</td>
                      <td>
                        <span className={`badge ${voucher.type === 'Receipt' ? 'badge-success' : 'badge-danger'}`}>
                          {voucher.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ marginBottom: '5px' }}>
                          {voucher.entries.map((entry, i) => (
                            <div key={i} style={{ fontSize: '13px', color: '#666' }}>
                              {entry.ledgerName}
                            </div>
                          ))}
                        </div>
                        {voucher.narration && (
                          <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                            {voucher.narration}
                          </div>
                        )}
                      </td>
                      <td className="amount" style={{ color: voucher.type === 'Receipt' ? '#28a745' : '#999' }}>
                        {voucher.type === 'Receipt' ? voucherTotal.toFixed(2) : '-'}
                      </td>
                      <td className="amount" style={{ color: voucher.type === 'Payment' ? '#dc3545' : '#999' }}>
                        {voucher.type === 'Payment' ? voucherTotal.toFixed(2) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'right', padding: '15px' }}><strong>TOTAL</strong></td>
                  <td className="amount" style={{ padding: '15px', fontSize: '16px', color: '#28a745' }}>
                    ₹ {totalReceipts.toFixed(2)}
                  </td>
                  <td className="amount" style={{ padding: '15px', fontSize: '16px', color: '#dc3545' }}>
                    ₹ {totalPayments.toFixed(2)}
                  </td>
                </tr>
                <tr style={{ background: balance >= 0 ? '#d4edda' : '#fff3cd' }}>
                  <td colSpan="4" style={{ textAlign: 'right', padding: '15px' }}><strong>BALANCE</strong></td>
                  <td colSpan="2" className="amount" style={{ padding: '15px', fontSize: '18px', color: balance >= 0 ? '#28a745' : '#ff9800' }}>
                    ₹ {Math.abs(balance).toFixed(2)} {balance >= 0 ? '(Surplus)' : '(Deficit)'}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <DollarSign size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p>No cash transactions found for the selected period</p>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bar">
        <div>Cash Book - {vouchers.length} transactions</div>
        <div>Ctrl+P: Print | Ctrl+E: Export</div>
      </div>
    </div>
  );
};

export default CashBook;
