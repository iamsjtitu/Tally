import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Printer, Download } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8765/api';

const ProfitLoss = ({ company }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchProfitLoss();
  }, [company]);

  const fetchProfitLoss = async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/profit-loss?companyId=${company.id}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching P&L:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profit & loss...</div>;
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
        <h1>📈 Profit & Loss Statement - {company.name}</h1>
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
            <h3 style={{ fontSize: '18px', color: '#666' }}>Profit & Loss Statement</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>For the period ending {new Date().toLocaleDateString()}</p>
          </div>

          {data ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div className="card" style={{ background: '#e8f5e9', borderColor: '#28a745' }}>
                  <h4 style={{ color: '#28a745', marginBottom: '15px', fontSize: '16px' }}>Income</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
                    ₹ {data.income.toFixed(2)}
                  </div>
                </div>

                <div className="card" style={{ background: '#ffebee', borderColor: '#dc3545' }}>
                  <h4 style={{ color: '#dc3545', marginBottom: '15px', fontSize: '16px' }}>Expenses</h4>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
                    ₹ {data.expenses.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="card" style={{ 
                background: data.profit >= 0 ? '#d4edda' : '#f8d7da',
                borderColor: data.profit >= 0 ? '#28a745' : '#dc3545',
                borderWidth: '3px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    color: data.profit >= 0 ? '#155724' : '#721c24',
                    marginBottom: '10px'
                  }}>
                    {data.profit >= 0 ? 'Net Profit' : 'Net Loss'}
                  </h3>
                  <div style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold',
                    color: data.profit >= 0 ? '#28a745' : '#dc3545'
                  }}>
                    ₹ {Math.abs(data.profit).toFixed(2)}
                  </div>
                  <p style={{ 
                    marginTop: '10px', 
                    fontSize: '16px',
                    color: data.profit >= 0 ? '#155724' : '#721c24'
                  }}>
                    Profit Margin: {data.profitPercent}%
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
                <h4 style={{ marginBottom: '15px', color: '#003d7a' }}>Summary</h4>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px', fontWeight: '600' }}>Total Income</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#28a745', fontWeight: '600' }}>
                        ₹ {data.income.toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px', fontWeight: '600' }}>Total Expenses</td>
                      <td style={{ padding: '10px', textAlign: 'right', color: '#dc3545', fontWeight: '600' }}>
                        ₹ {data.expenses.toFixed(2)}
                      </td>
                    </tr>
                    <tr style={{ background: data.profit >= 0 ? '#d4edda' : '#f8d7da' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold', fontSize: '16px' }}>
                        {data.profit >= 0 ? 'Net Profit' : 'Net Loss'}
                      </td>
                      <td style={{ 
                        padding: '15px', 
                        textAlign: 'right', 
                        fontWeight: 'bold', 
                        fontSize: '18px',
                        color: data.profit >= 0 ? '#28a745' : '#dc3545'
                      }}>
                        ₹ {Math.abs(data.profit).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
              <TrendingUp size={64} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="footer-bar">
        <div>Profit & Loss Statement</div>
        <div>Ctrl+P: Print | Ctrl+E: Export</div>
      </div>
    </div>
  );
};

export default ProfitLoss;
