import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, ArrowLeft, Printer, Download } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8765/api';

const BalanceSheet = ({ company }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchBalanceSheet();
  }, [company]);

  const fetchBalanceSheet = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/balance-sheet?companyId=${company.id}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading balance sheet...</div>;
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
        <h1>📋 Balance Sheet - {company.name}</h1>
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

      <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            <ArrowLeft size={18} />
            Back to Reports
          </button>
        </div>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #003d7a', paddingBottom: '15px' }}>
            <h2 style={{ fontSize: '24px', color: '#003d7a', marginBottom: '5px' }}>{company.name}</h2>
            <h3 style={{ fontSize: '18px', color: '#666' }}>Balance Sheet</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>As on {new Date().toLocaleDateString()}</p>
          </div>

          {data ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div className="card" style={{ background: '#e3f2fd', borderColor: '#0066cc' }}>
                  <h4 style={{ color: '#0066cc', marginBottom: '15px', fontSize: '16px' }}>Total Assets</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066cc' }}>
                    ₹ {data.assets.toFixed(2)}
                  </div>
                </div>

                <div className="card" style={{ background: '#fff3e0', borderColor: '#ff9800' }}>
                  <h4 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '16px' }}>Total Liabilities</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>
                    ₹ {data.liabilities.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="card" style={{ 
                background: Math.abs(data.difference) < 0.01 ? '#d4edda' : '#fff3cd',
                borderColor: Math.abs(data.difference) < 0.01 ? '#28a745' : '#ffc107',
                borderWidth: '3px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    color: Math.abs(data.difference) < 0.01 ? '#155724' : '#856404',
                    marginBottom: '10px'
                  }}>
                    Difference
                  </h3>
                  <div style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold',
                    color: Math.abs(data.difference) < 0.01 ? '#28a745' : '#ff9800'
                  }}>
                    ₹ {Math.abs(data.difference).toFixed(2)}
                  </div>
                  <p style={{ 
                    marginTop: '10px', 
                    fontSize: '16px',
                    color: Math.abs(data.difference) < 0.01 ? '#155724' : '#856404'
                  }}>
                    {Math.abs(data.difference) < 0.01 ? '✅ Balance Sheet is balanced!' : '⚠️ Balance Sheet needs adjustment'}
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
                <h4 style={{ marginBottom: '15px', color: '#003d7a' }}>Summary</h4>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px', fontWeight: '600' }}>Assets</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#0066cc', fontWeight: '600' }}>
                        ₹ {data.assets.toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px', fontWeight: '600' }}>Liabilities</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#ff9800', fontWeight: '600' }}>
                        ₹ {data.liabilities.toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ background: Math.abs(data.difference) < 0.01 ? '#d4edda' : '#fff3cd' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold', fontSize: '16px' }}>Difference</td>
                      <td style={{ 
                        padding: '15px', 
                        textAlign: 'right', 
                        fontWeight: 'bold', 
                        fontSize: '18px',
                        color: Math.abs(data.difference) < 0.01 ? '#28a745' : '#ff9800'
                      }}>
                        ₹ {Math.abs(data.difference).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <PieChart size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bar">
        <div>Balance Sheet</div>
        <div>Ctrl+P: Print | Ctrl+E: Export</div>
      </div>
    </div>
  );
};

export default BalanceSheet;
