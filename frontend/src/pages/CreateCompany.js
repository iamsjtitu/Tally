import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Save, X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8765/api';

const CreateCompany = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: '',
    email: '',
    gstNumber: '',
    panNumber: '',
    financialYear: '2024-25',
    booksBeginning: new Date().toISOString().split('T')[0],
    currency: 'INR',
    currencySymbol: '₹'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/companies`, formData);
      alert('Company created successfully!');
      navigate('/companies');
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Failed to create company');
    }
  };

  return (
    <div>
      <div className="tally-header">
        <h1>🏢 Create New Company</h1>
      </div>

      <div className="tally-form">
        <div className="card-header">
          <Building2 size={24} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
          Company Information
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter company name"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              placeholder="Enter company address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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

          <div className="form-row">
            <div className="form-group">
              <label>GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="GST Number (if applicable)"
              />
            </div>
            <div className="form-group">
              <label>PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="PAN Number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Financial Year *</label>
              <select
                name="financialYear"
                value={formData.financialYear}
                onChange={handleChange}
                required
              >
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
            <div className="form-group">
              <label>Books Beginning From *</label>
              <input
                type="date"
                name="booksBeginning"
                value={formData.booksBeginning}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
            <div className="form-group">
              <label>Currency Symbol</label>
              <input
                type="text"
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                placeholder="₹"
              />
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Save Company
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/companies')}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="footer-bar">
        <div>Create Company</div>
        <div>Press Ctrl+S to Save | Esc to Cancel</div>
      </div>
    </div>
  );
};

export default CreateCompany;
