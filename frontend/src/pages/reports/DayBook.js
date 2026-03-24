import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Printer, Download } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config';

const DayBook = ({ company }) => {
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchDayBook();
  }, [company, selectedDate]);

  const fetchDayBook = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/day-book?companyId=${company.id}&date=${selectedDate}`);
      setVouchers(response.data);
    } catch (error) {
      console.error('Error fetching day book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading day book...</div>;
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

  const totalAmount = vouchers.reduce((sum, v) => {
    const voucherTotal = v.entries.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    return sum + voucherTotal;
  }, 0);

  return (
    <div>
      <div className="tally-header">
        <h1>📅 Day Book - {company.name}</h1>
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
            <label style={{ fontWeight: '600' }}>Select Date:</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #003d7a', paddingBottom: '15px' }}>
            <h2 style={{ fontSize: '24px', color: '#003d7a', marginBottom: '5px' }}>{company.name}</h2>
            <h3 style={{ fontSize: '18px', color: '#666' }}>Day Book</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>{new Date(selectedDate).toLocaleDateString()}</p>
          </div>

          {vouchers.length > 0 ? (
            <>
              <table className="tally-table">
                <thead>
                  <tr>
                    <th>Voucher No</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Particulars</th>
                    <th className="amount">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => {
                    const voucherTotal = voucher.entries.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) / 2;
                    return (
                      <tr key={voucher.id}>
                        <td>{voucher.voucherNumber}</td>
                        <td>
                          <span className="badge badge-success">{voucher.type}</span>
                        </td>
                        <td>{new Date(voucher.date).toLocaleDateString()}</td>
                        <td>
                          <div style={{ marginBottom: '5px' }}>
                            {voucher.entries.map((entry, i) => (
                              <div key={i} style={{ fontSize: '13px', color: '#666' }}>
                                {entry.ledgerName} ({entry.type}): ₹{parseFloat(entry.amount).toFixed(2)}
                              </div>
                            ))}
                          </div>
                          {voucher.narration && (
                            <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                              {voucher.narration}
                            </div>
                          )}
                        </td>
                        <td className="amount">{voucherTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'right', padding: '15px' }}><strong>TOTAL</strong></td>
                    <td className="amount" style={{ padding: '15px', fontSize: '16px', color: '#0066cc' }}>
                      ₹ {(totalAmount / 2).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#0066cc' }}>
                  <strong>Total Transactions: {vouchers.length}</strong>
                </p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <Calendar size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p>No transactions found for {new Date(selectedDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bar">
        <div>Day Book - {vouchers.length} transactions</div>
        <div>Ctrl+P: Print | Ctrl+E: Export | Arrow keys: Change date</div>
      </div>
    </div>
  );
};

export default DayBook;
