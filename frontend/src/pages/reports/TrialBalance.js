import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Printer, Download } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config';

const TrialBalance = ({ company }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchTrialBalance();
  }, [company]);

  const fetchTrialBalance = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/trial-balance?companyId=${company.id}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching trial balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading trial balance...</div>;
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

  return (
    <div>
      <div className="tally-header">
        <h1>📄 Trial Balance - {company.name}</h1>
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

      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            <ArrowLeft size={18} />
            Back to Reports
          </button>
        </div>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #003d7a', paddingBottom: '15px' }}>
            <h2 style={{ fontSize: '24px', color: '#003d7a', marginBottom: '5px' }}>{company.name}</h2>
            <h3 style={{ fontSize: '18px', color: '#666' }}>Trial Balance</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>As on {new Date().toLocaleDateString()}</p>
          </div>

          {data && data.data && data.data.length > 0 ? (
            <>
              <table className="tally-table">
                <thead>
                  <tr>
                    <th>Particulars</th>
                    <th>Group</th>
                    <th className="amount">Debit (₹)</th>
                    <th className="amount">Credit (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.ledger}</td>
                      <td>{item.group}</td>
                      <td className="amount">{item.debit > 0 ? item.debit.toFixed(2) : '-'}</td>
                      <td className="amount">{item.credit > 0 ? item.credit.toFixed(2) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'right', padding: '15px' }}><strong>TOTAL</strong></td>
                    <td className="amount" style={{ padding: '15px', fontSize: '16px', color: '#28a745' }}>
                      ₹ {data.totals.debit.toFixed(2)}
                    </td>
                    <td className="amount" style={{ padding: '15px', fontSize: '16px', color: '#dc3545' }}>
                      ₹ {data.totals.credit.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div style={{ marginTop: '20px', padding: '15px', background: data.totals.debit === data.totals.credit ? '#d4edda' : '#f8d7da', borderRadius: '4px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: data.totals.debit === data.totals.credit ? '#155724' : '#721c24' }}>
                  {data.totals.debit === data.totals.credit ? (
                    <strong>✅ Trial Balance is balanced!</strong>
                  ) : (
                    <strong>⚠️ Trial Balance is not balanced. Difference: ₹{Math.abs(data.totals.debit - data.totals.credit).toFixed(2)}</strong>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <FileText size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p>No ledger data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bar">
        <div>Trial Balance</div>
        <div>Ctrl+P: Print | Ctrl+E: Export</div>
      </div>
    </div>
  );
};

export default TrialBalance;
