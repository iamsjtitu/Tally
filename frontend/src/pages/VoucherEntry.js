import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Save, X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8765/api';

const VoucherEntry = ({ company }) => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [ledgers, setLedgers] = useState([]);
  const [formData, setFormData] = useState({
    type: type || 'Receipt',
    date: new Date().toISOString().split('T')[0],
    voucherNumber: '',
    narration: '',
    entries: [
      { ledgerId: '', ledgerName: '', type: 'debit', amount: 0 },
      { ledgerId: '', ledgerName: '', type: 'credit', amount: 0 }
    ]
  });

  const voucherTypes = ['Receipt', 'Payment', 'Journal', 'Contra', 'Sales', 'Purchase'];

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchLedgers();
  }, [company]);

  const fetchLedgers = async () => {
    try {
      const response = await axios.get(`${API_URL}/ledgers?companyId=${company.id}`);
      setLedgers(response.data);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...formData.entries];
    newEntries[index][field] = value;
    
    if (field === 'ledgerId') {
      const ledger = ledgers.find(l => l.id === value);
      newEntries[index].ledgerName = ledger ? ledger.name : '';
    }
    
    setFormData({ ...formData, entries: newEntries });
  };

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { ledgerId: '', ledgerName: '', type: 'debit', amount: 0 }]
    });
  };

  const removeEntry = (index) => {
    if (formData.entries.length <= 2) {
      alert('Minimum 2 entries required');
      return;
    }
    const newEntries = formData.entries.filter((_, i) => i !== index);
    setFormData({ ...formData, entries: newEntries });
  };

  const calculateTotals = () => {
    const debitTotal = formData.entries
      .filter(e => e.type === 'debit')
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const creditTotal = formData.entries
      .filter(e => e.type === 'credit')
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    return { debitTotal, creditTotal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { debitTotal, creditTotal } = calculateTotals();
    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      alert('Debit and Credit totals must match!');
      return;
    }

    try {
      await axios.post(`${API_URL}/vouchers`, {
        ...formData,
        companyId: company.id
      });
      alert('Voucher saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving voucher:', error);
      alert('Failed to save voucher');
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

  const { debitTotal, creditTotal } = calculateTotals();
  const difference = Math.abs(debitTotal - creditTotal);

  return (
    <div>
      <div className="tally-header">
        <h1>📝 Voucher Entry - {company.name}</h1>
      </div>

      <div className="tally-form" style={{ maxWidth: '1000px' }}>
        <div className="card-header">
          <FileText size={24} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
          {formData.type} Voucher
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Voucher Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {voucherTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Voucher Number</label>
            <input
              type="text"
              name="voucherNumber"
              value={formData.voucherNumber}
              onChange={handleChange}
              placeholder="Auto-generated if left blank"
            />
          </div>

          <div className="voucher-entries">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', color: '#003d7a' }}>Entries</h3>
              <button type="button" className="btn btn-primary" onClick={addEntry} style={{ padding: '6px 12px' }}>
                <Plus size={16} />
                Add Entry
              </button>
            </div>

            {formData.entries.map((entry, index) => (
              <div key={index} className="voucher-entry-row" style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px', gap: '10px', alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Ledger</label>
                  <select
                    value={entry.ledgerId}
                    onChange={(e) => handleEntryChange(index, 'ledgerId', e.target.value)}
                    required
                  >
                    <option value="">Select Ledger</option>
                    {ledgers.map(ledger => (
                      <option key={ledger.id} value={ledger.id}>{ledger.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Type</label>
                  <select
                    value={entry.type}
                    onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
                    required
                  >
                    <option value="debit">Debit</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Amount</label>
                  <input
                    type="number"
                    value={entry.amount}
                    onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                    step="0.01"
                    required
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeEntry(index)}
                  style={{ padding: '10px', marginTop: '24px' }}
                  disabled={formData.entries.length <= 2}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="voucher-totals" style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', marginTop: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Debit</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#28a745' }}>₹ {debitTotal.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Total Credit</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#dc3545' }}>₹ {creditTotal.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Difference</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: difference > 0.01 ? '#dc3545' : '#28a745' }}>
                  ₹ {difference.toFixed(2)}
                  {difference > 0.01 && ' ⚠️'}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Narration</label>
            <textarea
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              rows="3"
              placeholder="Enter narration/description"
            />
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={difference > 0.01}>
              <Save size={18} />
              Save Voucher
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="footer-bar">
        <div>{formData.type} Voucher Entry</div>
        <div>Ctrl+S: Save | Esc: Cancel | Ctrl+A: Add Entry</div>
      </div>
    </div>
  );
};

export default VoucherEntry;
