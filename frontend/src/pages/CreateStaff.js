import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Save, X } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const CreateStaff = ({ company }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    address: '',
    joiningDate: new Date().toISOString().split('T')[0],
    monthlySalary: 10000,
    bankAccount: '',
    bankName: '',
    ifscCode: ''
  });

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
      await axios.post(`${API_URL}/staff`, {
        ...formData,
        companyId: company.id
      });
      alert('Staff added successfully!');
      navigate('/staff');
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Failed to add staff');
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
        <h1>👤 Add New Staff - {company.name}</h1>
      </div>

      <div className="tally-form">
        <div className="card-header">
          <Users size={24} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
          Staff Information
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Employee ID *</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                placeholder="e.g., EMP001"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="e.g., Accountant, Manager"
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Accounts, Sales"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone number"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              placeholder="Enter address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Joining Date *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Monthly Salary *</label>
              <input
                type="number"
                name="monthlySalary"
                value={formData.monthlySalary}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="10000"
              />
              <small style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                Fixed monthly salary (same for 28, 30, or 31 days)
              </small>
            </div>
          </div>

          <div className="card-header" style={{ marginTop: '30px' }}>
            Bank Details (Optional)
          </div>

          <div className="form-group">
            <label>Bank Account Number</label>
            <input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              placeholder="Bank account number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g., HDFC Bank"
              />
            </div>
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="e.g., HDFC0001234"
              />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Staff
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/staff')}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="footer-bar">
        <div>Add Staff Member</div>
        <div>Ctrl+S: Save | Esc: Cancel</div>
      </div>
    </div>
  );
};

export default CreateStaff;
