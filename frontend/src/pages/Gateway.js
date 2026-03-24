import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, BookOpen, FileText, PieChart, Settings, Users } from 'lucide-react';

const Gateway = ({ company }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.altKey && e.key === 'g') {
        e.preventDefault();
        navigate('/');
      }
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        navigate('/companies');
      }
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        navigate('/ledgers');
      }
      if (e.altKey && e.key === 'v') {
        e.preventDefault();
        navigate('/vouchers/receipt');
      }
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        navigate('/reports');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const menuItems = [
    {
      title: 'Company Info',
      description: 'Create, Select & Manage Companies',
      icon: <Building2 size={32} />,
      shortcut: 'Alt+C',
      path: '/companies'
    },
    {
      title: 'Masters',
      description: 'Ledgers, Groups, Stock Items',
      icon: <BookOpen size={32} />,
      shortcut: 'Alt+L',
      path: '/ledgers'
    },
    {
      title: 'Staff & Payroll',
      description: 'Staff, Attendance, Salary Payment',
      icon: <Users size={32} />,
      shortcut: 'Alt+S',
      path: '/staff'
    },
    {
      title: 'Voucher Entry',
      description: 'Receipt, Payment, Journal, Sales, Purchase',
      icon: <FileText size={32} />,
      shortcut: 'Alt+V',
      path: '/vouchers/receipt'
    },
    {
      title: 'Display Reports',
      description: 'Trial Balance, P&L, Balance Sheet',
      icon: <PieChart size={32} />,
      shortcut: 'Alt+R',
      path: '/reports'
    }
  ];

  return (
    <div>
      <div className="tally-header">
        <h1>🧾 Tally Accounting Software</h1>
        <div className="company-info">
          {company ? (
            <>
              <span><strong>Company:</strong> {company.name}</span>
              <span>|</span>
              <span><strong>FY:</strong> {company.financialYear}</span>
            </>
          ) : (
            <span style={{ color: '#ffc107' }}>⚠️ No Company Selected</span>
          )}
          <span className="version">v1.0.0</span>
        </div>
      </div>

      <div className="tally-menu">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: '#003d7a', marginBottom: '10px' }}>Gateway of Tally</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Select an option to continue</p>
        </div>

        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="menu-item"
              onClick={() => navigate(item.path)}
            >
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="menu-item-shortcut">{item.shortcut}</div>
            </div>
          ))}
        </div>

        {!company && (
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            background: '#fff3cd', 
            border: '1px solid #ffc107',
            borderRadius: '4px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '40px auto 0'
          }}>
            <p style={{ fontSize: '16px', color: '#856404', marginBottom: '10px' }}>
              <strong>Getting Started</strong>
            </p>
            <p style={{ fontSize: '14px', color: '#856404' }}>
              Please select or create a company to start using Tally.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '15px' }}
              onClick={() => navigate('/companies')}
            >
              <Building2 size={18} />
              Select Company
            </button>
          </div>
        )}
      </div>

      <div className="footer-bar">
        <div className="footer-shortcuts">
          <div className="shortcut">
            <span className="shortcut-key">Alt+G</span>
            <span>Gateway</span>
          </div>
          <div className="shortcut">
            <span className="shortcut-key">Alt+C</span>
            <span>Companies</span>
          </div>
          <div className="shortcut">
            <span className="shortcut-key">Alt+V</span>
            <span>Vouchers</span>
          </div>
          <div className="shortcut">
            <span className="shortcut-key">Alt+R</span>
            <span>Reports</span>
          </div>
        </div>
        <div>
          © 2025 Tally Clone - Desktop Edition
        </div>
      </div>
    </div>
  );
};

export default Gateway;
