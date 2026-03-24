import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const LedgerList = ({ company }) => {
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('all');

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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLedger = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this ledger?')) {
      try {
        await axios.delete(`${API_URL}/ledgers/${id}`);
        fetchLedgers();
      } catch (error) {
        console.error('Error deleting ledger:', error);
        alert('Failed to delete ledger');
      }
    }
  };

  const filteredLedgers = filterGroup === 'all' 
    ? ledgers 
    : ledgers.filter(l => l.group === filterGroup);

  const ledgerGroups = [...new Set(ledgers.map(l => l.group))];

  if (loading) {
    return <div className="loading">Loading ledgers...</div>;
  }

  return (
    <div>
      <div className="tally-header">
        <h1>📚 Ledger Management - {company?.name}</h1>
        <button className="btn btn-primary" onClick={() => navigate('/ledgers/create')}>
          <Plus size={18} />
          Create Ledger
        </button>
      </div>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back to Gateway
          </button>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontWeight: '600' }}>Filter by Group:</label>
            <select 
              value={filterGroup} 
              onChange={(e) => setFilterGroup(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="all">All Groups</option>
              {ledgerGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredLedgers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <BookOpen size={64} style={{ margin: '0 auto 20px', color: '#ccc' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No Ledgers Found</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Create your first ledger to start accounting</p>
            <button className="btn btn-primary" onClick={() => navigate('/ledgers/create')}>
              <Plus size={18} />
              Create Ledger
            </button>
          </div>
        ) : (
          <table className="tally-table">
            <thead>
              <tr>
                <th>Ledger Name</th>
                <th>Group</th>
                <th>Type</th>
                <th className="amount">Opening Balance</th>
                <th className="amount">Current Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedgers.map((ledger) => (
                <tr key={ledger.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <BookOpen size={18} style={{ color: '#0066cc' }} />
                      <strong>{ledger.name}</strong>
                    </div>
                  </td>
                  <td>{ledger.group}</td>
                  <td>
                    <span className={`badge ${ledger.type === 'Debit' ? 'badge-success' : 'badge-danger'}`}>
                      {ledger.type}
                    </span>
                  </td>
                  <td className="amount">₹ {parseFloat(ledger.openingBalance || 0).toFixed(2)}</td>
                  <td className="amount">
                    <strong style={{ color: ledger.balance >= 0 ? '#28a745' : '#dc3545' }}>
                      ₹ {Math.abs(parseFloat(ledger.balance || 0)).toFixed(2)}
                      {ledger.balance < 0 ? ' Cr' : ' Dr'}
                    </strong>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => handleDeleteLedger(ledger.id, e)}
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="footer-bar">
        <div>Total Ledgers: {filteredLedgers.length}</div>
        <div>Alt+L: Ledgers | Alt+C: Create</div>
      </div>
    </div>
  );
};

export default LedgerList;
