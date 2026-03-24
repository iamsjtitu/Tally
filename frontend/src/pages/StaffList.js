import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, ArrowLeft, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const StaffList = ({ company }) => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchStaff();
  }, [company]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff?companyId=${company.id}`);
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await axios.delete(`${API_URL}/staff/${id}`);
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading staff...</div>;
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
        <h1>👥 Staff Management - {company.name}</h1>
        <button className="btn btn-primary" onClick={() => navigate('/staff/create')}>
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={18} />
            Back to Gateway
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => navigate('/attendance')}>
              <Calendar size={18} />
              Mark Attendance
            </button>
            <button className="btn btn-success" onClick={() => navigate('/salary')}>
              <DollarSign size={18} />
              Pay Salary
            </button>
          </div>
        </div>

        {staff.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <Users size={64} style={{ margin: '0 auto 20px', color: '#ccc' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No Staff Members</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Add your first staff member</p>
            <button className="btn btn-primary" onClick={() => navigate('/staff/create')}>
              <Plus size={18} />
              Add Staff
            </button>
          </div>
        ) : (
          <table className="tally-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Position</th>
                <th>Department</th>
                <th>Phone</th>
                <th className="amount">Monthly Salary</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Users size={18} style={{ color: '#0066cc' }} />
                      <strong>{member.name}</strong>
                    </div>
                  </td>
                  <td>{member.employeeId}</td>
                  <td>{member.position}</td>
                  <td>{member.department || '-'}</td>
                  <td>{member.phone}</td>
                  <td className="amount">₹ {parseFloat(member.monthlySalary || 10000).toFixed(2)}</td>
                  <td>{new Date(member.joiningDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${member.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => handleDelete(member.id, e)}
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
        <div>Total Staff: {staff.length}</div>
        <div>Alt+S: Staff | Alt+A: Attendance | Alt+P: Salary</div>
      </div>
    </div>
  );
};

export default StaffList;
