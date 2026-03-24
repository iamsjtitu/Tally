import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Save, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const CreateLedger = ({ company }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    group: 'Sundry Debtors',
    type: 'Debit',
    openingBalance: 0,
    companyId: company?.id || ''
  });

  const ledgerGroups = [
    'Capital Account',
    'Current Assets',
    'Current Liabilities',
    'Fixed Assets',
    'Loans (Liability)',
    'Sundry Creditors',
    'Sundry Debtors',
    'Bank Accounts',
    'Cash-in-Hand',
    'Duties & Taxes',
    'Expenses (Direct)',
    'Expenses (Indirect)',
    'Income (Direct)',
    'Income (Indirect)',
    'Purchase Accounts',
    'Sales Accounts',
    'Stock-in-Hand'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }

    try {
      await axios.post(`${API_URL}/ledgers`, {
        ...formData,
        companyId: company.id
      });
      alert('Ledger created successfully!');
      navigate('/ledgers');
    } catch (error) {
      console.error('Error creating ledger:', error);
      alert('Failed to create ledger');
    }
  };

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
        <h1>📚 Create New Ledger - {company.name}</h1>
      </div>

      <div className="tally-form">
        <div className="card-header">
          <BookOpen size={24} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
          Ledger Information
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ledger Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter ledger name"
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Group *</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                required
              >
                {ledgerGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Opening Balance</label>
            <input
              type="number"
              name="openingBalance"
              value={formData.openingBalance}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
            />
            <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Enter opening balance as on {new Date(company.booksBeginning).toLocaleDateString()}
            </small>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Ledger
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/ledgers')}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="footer-bar">
        <div>Create Ledger</div>
        <div>Ctrl+S: Save | Esc: Cancel</div>
      </div>
    </div>
  );
};

export default CreateLedger;
