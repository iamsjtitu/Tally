import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const PaySalary = ({ company }) => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchStaff();
    fetchSalaryPayments();
  }, [company, selectedMonth, selectedYear]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff?companyId=${company.id}&status=active`);
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaryPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/salary?companyId=${company.id}&month=${selectedMonth}&year=${selectedYear}`);
      setSalaryPayments(response.data);
    } catch (error) {
      console.error('Error fetching salary payments:', error);
    }
  };

  const isPaid = (staffId) => {
    return salaryPayments.some(p => p.staffId === staffId);
  };

  const handlePaySalary = async (member) => {
    if (isPaid(member.id)) {
      alert('Salary already paid for this month');
      return;
    }

    const confirmPay = window.confirm(
      `Pay salary to ${member.name}?\n\nAmount: ₹${member.monthlySalary}\nMonth: ${getMonthName(selectedMonth)} ${selectedYear}\n\nThis will create a voucher entry (Salary Expense Dr, Cash Cr)`
    );

    if (!confirmPay) return;

    try {
      const response = await axios.post(`${API_URL}/salary`, {
        companyId: company.id,
        staffId: member.id,
        staffName: member.name,
        month: selectedMonth,
        year: selectedYear,
        amount: member.monthlySalary,
        paymentDate: new Date().toISOString().split('T')[0],
        notes: `Salary for ${getMonthName(selectedMonth)} ${selectedYear}`
      });

      alert(`Salary paid successfully!\n\nVoucher No: ${response.data.voucher.voucherNumber}\nAmount: ₹${member.monthlySalary}`);
      fetchSalaryPayments();
    } catch (error) {
      console.error('Error paying salary:', error);
      alert(error.response?.data?.error || 'Failed to pay salary');
    }
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
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

  const totalSalary = staff.reduce((sum, member) => sum + parseFloat(member.monthlySalary || 10000), 0);
  const paidCount = salaryPayments.length;
  const pendingCount = staff.length - paidCount;
  const paidAmount = salaryPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const pendingAmount = totalSalary - paidAmount;
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  return (
    <div>
      <div className="tally-header">
        <h1>💰 Salary Payment - {company.name}</h1>
      </div>

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/staff')}>
            <ArrowLeft size={18} />
            Back to Staff
          </button>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontWeight: '600' }}>Period:</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {[2023, 2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '4px', border: '1px solid #0066cc' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#0066cc' }}>
            <strong>ℹ️ Note:</strong> Monthly salary is FIXED at ₹10,000 (or custom amount) regardless of month days. 
            {getMonthName(selectedMonth)} {selectedYear} has <strong>{daysInMonth} days</strong>, but salary remains the same.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div className="card" style={{ background: '#e3f2fd', borderColor: '#0066cc', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#0066cc' }}>Total Staff</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066cc' }}>{staff.length}</div>
          </div>
          <div className="card" style={{ background: '#d4edda', borderColor: '#28a745', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#155724' }}>Paid</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{paidCount}</div>
            <div style={{ fontSize: '12px', color: '#155724' }}>₹{paidAmount.toFixed(2)}</div>
          </div>
          <div className="card" style={{ background: '#fff3cd', borderColor: '#ffc107', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#856404' }}>Pending</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>{pendingCount}</div>
            <div style={{ fontSize: '12px', color: '#856404' }}>₹{pendingAmount.toFixed(2)}</div>
          </div>
          <div className="card" style={{ background: '#f5f5f5', borderColor: '#666', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>Total Salary</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>₹{totalSalary.toFixed(0)}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            Salary Payment - {getMonthName(selectedMonth)} {selectedYear}
          </div>

          <table className="tally-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Position</th>
                <th className="amount">Monthly Salary</th>
                <th>Days in Month</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => {
                const paid = isPaid(member.id);
                const payment = salaryPayments.find(p => p.staffId === member.id);
                
                return (
                  <tr key={member.id} style={{ background: paid ? '#d4edda' : 'white' }}>
                    <td>{member.employeeId}</td>
                    <td><strong>{member.name}</strong></td>
                    <td>{member.position}</td>
                    <td className="amount">₹ {parseFloat(member.monthlySalary || 10000).toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>{daysInMonth} days</td>
                    <td>
                      {paid ? (
                        <span className="badge badge-success">
                          <CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                          Paid
                        </span>
                      ) : (
                        <span className="badge badge-warning">
                          <AlertCircle size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      {paid ? (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Voucher: {payment?.voucherNumber}<br/>
                          Date: {new Date(payment?.paymentDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <button
                          className="btn btn-success"
                          onClick={() => handlePaySalary(member)}
                          style={{ padding: '8px 16px', fontSize: '14px' }}
                        >
                          <DollarSign size={16} />
                          Pay Salary
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot style={{ background: '#f5f5f5', fontWeight: 'bold' }}>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', padding: '15px' }}><strong>TOTAL</strong></td>
                <td className="amount" style={{ padding: '15px', fontSize: '16px' }}>₹ {totalSalary.toFixed(2)}</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="footer-bar">
        <div>Salary Payment - {getMonthName(selectedMonth)} {selectedYear} ({daysInMonth} days)</div>
        <div>Paid: {paidCount} | Pending: {pendingCount}</div>
      </div>
    </div>
  );
};

export default PaySalary;
