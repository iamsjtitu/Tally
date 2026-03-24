import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, FileText, TrendingUp, Calendar, DollarSign, BookOpen, ArrowLeft } from 'lucide-react';

const Reports = ({ company }) => {
  const navigate = useNavigate();

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

  const reports = [
    {
      title: 'Trial Balance',
      description: 'View all ledger balances',
      icon: <FileText size={32} />,
      path: '/reports/trial-balance',
      color: '#0066cc'
    },
    {
      title: 'Profit & Loss',
      description: 'Income and Expenses statement',
      icon: <TrendingUp size={32} />,
      path: '/reports/profit-loss',
      color: '#28a745'
    },
    {
      title: 'Balance Sheet',
      description: 'Assets and Liabilities',
      icon: <PieChart size={32} />,
      path: '/reports/balance-sheet',
      color: '#dc3545'
    },
    {
      title: 'Day Book',
      description: 'Daily transactions',
      icon: <Calendar size={32} />,
      path: '/reports/day-book',
      color: '#ffc107'
    },
    {
      title: 'Cash Book',
      description: 'Cash receipts and payments',
      icon: <DollarSign size={32} />,
      path: '/reports/cash-book',
      color: '#17a2b8'
    }
  ];

  return (
    <div>
      <div className="tally-header">
        <h1>📈 Reports - {company.name}</h1>
      </div>

      <div className="tally-menu">
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back to Gateway
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: '#003d7a', marginBottom: '10px' }}>Display Reports</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Select a report to view</p>
        </div>

        <div className="menu-grid">
          {reports.map((report, index) => (
            <div
              key={index}
              className="menu-item"
              onClick={() => navigate(report.path)}
              style={{ borderLeft: `4px solid ${report.color}` }}
            >
              <div className="menu-item-icon" style={{ color: report.color }}>
                {report.icon}
              </div>
              <div className="menu-item-content">
                <h3>{report.title}</h3>
                <p>{report.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bar">
        <div>Reports - {company.name}</div>
        <div>Alt+R: Reports | Alt+G: Gateway</div>
      </div>
    </div>
  );
};

export default Reports;
