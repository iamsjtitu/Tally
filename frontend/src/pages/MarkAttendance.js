import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Save, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const MarkAttendance = ({ company }) => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState([]);

  useEffect(() => {
    if (!company) {
      alert('Please select a company first');
      navigate('/companies');
      return;
    }
    fetchStaff();
    fetchTodayAttendance();
  }, [company, selectedDate]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff?companyId=${company.id}&status=active`);
      setStaff(response.data);
      
      const initialAttendance = {};
      response.data.forEach(member => {
        initialAttendance[member.id] = 'present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance?companyId=${company.id}&date=${selectedDate}`);
      setTodayAttendance(response.data);
      
      const existingAttendance = {};
      response.data.forEach(record => {
        existingAttendance[record.staffId] = record.status;
      });
      setAttendance(prev => ({ ...prev, ...existingAttendance }));
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleAttendanceChange = (staffId, status) => {
    setAttendance({
      ...attendance,
      [staffId]: status
    });
  };

  const handleSubmit = async () => {
    try {
      const promises = staff.map(member => {
        const existing = todayAttendance.find(a => a.staffId === member.id);
        
        if (existing) {
          if (existing.status !== attendance[member.id]) {
            return axios.put(`${API_URL}/attendance/${existing.id}`, {
              status: attendance[member.id]
            });
          }
          return Promise.resolve();
        } else {
          return axios.post(`${API_URL}/attendance`, {
            companyId: company.id,
            staffId: member.id,
            staffName: member.name,
            date: selectedDate,
            status: attendance[member.id]
          });
        }
      });

      await Promise.all(promises);
      alert('Attendance marked successfully!');
      fetchTodayAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
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

  const summary = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    halfDay: Object.values(attendance).filter(s => s === 'half-day').length,
    leave: Object.values(attendance).filter(s => s === 'leave').length
  };

  return (
    <div>
      <div className="tally-header">
        <h1>📅 Mark Attendance - {company.name}</h1>
      </div>

      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/staff')}>
            <ArrowLeft size={18} />
            Back to Staff
          </button>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontWeight: '600' }}>Date:</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
          <div className="card" style={{ background: '#d4edda', borderColor: '#28a745', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#155724' }}>Present</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{summary.present}</div>
          </div>
          <div className="card" style={{ background: '#f8d7da', borderColor: '#dc3545', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#721c24' }}>Absent</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>{summary.absent}</div>
          </div>
          <div className="card" style={{ background: '#fff3cd', borderColor: '#ffc107', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#856404' }}>Half Day</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>{summary.halfDay}</div>
          </div>
          <div className="card" style={{ background: '#d1ecf1', borderColor: '#17a2b8', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#0c5460' }}>Leave</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>{summary.leave}</div>
          </div>
        </div>

        <div className="card">
          <table className="tally-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Position</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.id}>
                  <td>{member.employeeId}</td>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.position}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          background: attendance[member.id] === 'present' ? '#28a745' : '#e0e0e0',
                          color: attendance[member.id] === 'present' ? 'white' : '#666',
                          border: 'none'
                        }}
                        onClick={() => handleAttendanceChange(member.id, 'present')}
                      >
                        <CheckCircle size={16} /> Present
                      </button>
                      <button
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          background: attendance[member.id] === 'absent' ? '#dc3545' : '#e0e0e0',
                          color: attendance[member.id] === 'absent' ? 'white' : '#666',
                          border: 'none'
                        }}
                        onClick={() => handleAttendanceChange(member.id, 'absent')}
                      >
                        <XCircle size={16} /> Absent
                      </button>
                      <button
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          background: attendance[member.id] === 'half-day' ? '#ff9800' : '#e0e0e0',
                          color: attendance[member.id] === 'half-day' ? 'white' : '#666',
                          border: 'none'
                        }}
                        onClick={() => handleAttendanceChange(member.id, 'half-day')}
                      >
                        Half Day
                      </button>
                      <button
                        className="btn"
                        style={{
                          padding: '6px 12px',
                          background: attendance[member.id] === 'leave' ? '#17a2b8' : '#e0e0e0',
                          color: attendance[member.id] === 'leave' ? 'white' : '#666',
                          border: 'none'
                        }}
                        onClick={() => handleAttendanceChange(member.id, 'leave')}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 30px' }} onClick={handleSubmit}>
              <Save size={20} />
              Save Attendance
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bar">
        <div>Attendance - {new Date(selectedDate).toLocaleDateString()}</div>
        <div>Total Staff: {staff.length}</div>
      </div>
    </div>
  );
};

export default MarkAttendance;
