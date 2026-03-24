import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Edit, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const CompanyList = ({ onSelect }) => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (company) => {
    onSelect(company);
    navigate('/');
  };

  const handleDeleteCompany = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`${API_URL}/companies/${id}`);
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete company');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading companies...</div>;
  }

  return (
    <div>
      <div className="tally-header">
        <h1>🏢 Company Management</h1>
        <button className="btn btn-primary" onClick={() => navigate('/companies/create')}>
          <Plus size={18} />
          Create New Company
        </button>
      </div>

      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back to Gateway
          </button>
          <h2 style={{ fontSize: '24px', color: '#003d7a' }}>Select Company</h2>
        </div>

        {companies.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <Building2 size={64} style={{ margin: '0 auto 20px', color: '#ccc' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No Companies Found</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Create your first company to get started</p>
            <button className="btn btn-primary" onClick={() => navigate('/companies/create')}>
              <Plus size={18} />
              Create Company
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {companies.map((company) => (
              <div
                key={company.id}
                className="card"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '2px solid #e0e0e0'
                }}
                onClick={() => handleSelectCompany(company)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0066cc';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,102,204,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                      <Building2 size={32} style={{ color: '#0066cc' }} />
                      <div>
                        <h3 style={{ fontSize: '20px', marginBottom: '5px' }}>{company.name}</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>{company.address}</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
                      <div>
                        <span style={{ fontSize: '12px', color: '#666' }}>Financial Year</span>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{company.financialYear}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#666' }}>GST Number</span>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{company.gstNumber || 'Not Set'}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: '12px', color: '#666' }}>Books Beginning</span>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(company.booksBeginning).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => handleDeleteCompany(company.id, e)}
                      style={{ padding: '8px 12px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="footer-bar">
        <div>Total Companies: {companies.length}</div>
        <div>Press Enter to select | Delete to remove</div>
      </div>
    </div>
  );
};

export default CompanyList;
