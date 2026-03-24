import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const LedgerReport = ({ company }) => {
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

  return (
    <div>
      <div className="tally-header">
        <h1>📖 Ledger Report - {company.name}</h1>
      </div>

      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
            <ArrowLeft size={18} />
            Back to Reports
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <BookOpen size={64} style={{ margin: '0 auto 20px', color: '#ccc' }} />
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Ledger Report</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Select a ledger from Ledgers list to view detailed report</p>
          <button className="btn btn-primary" onClick={() => navigate('/ledgers')}>
            View Ledgers
          </button>
        </div>
      </div>

      <div className="footer-bar">
        <div>Ledger Report</div>
        <div>Select ledger to view report</div>
      </div>
    </div>
  );
};

export default LedgerReport;
