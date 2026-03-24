const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/attendance.json');

function getAttendance() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveAttendance(attendance) {
  fs.ensureDirSync(path.dirname(DATA_FILE));
  fs.writeFileSync(DATA_FILE, JSON.stringify(attendance, null, 2));
}

// Get attendance records
router.get('/', (req, res) => {
  try {
    const attendance = getAttendance();
    const { companyId, staffId, month, year, date } = req.query;
    
    let filtered = attendance;
    if (companyId) {
      filtered = filtered.filter(a => a.companyId === companyId);
    }
    if (staffId) {
      filtered = filtered.filter(a => a.staffId === staffId);
    }
    if (month && year) {
      filtered = filtered.filter(a => {
        const recordDate = new Date(a.date);
        return recordDate.getMonth() + 1 === parseInt(month) && 
               recordDate.getFullYear() === parseInt(year);
      });
    }
    if (date) {
      filtered = filtered.filter(a => a.date === date);
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance
router.post('/', (req, res) => {
  try {
    const attendance = getAttendance();
    
    // Check if already marked for this date
    const existing = attendance.find(a => 
      a.staffId === req.body.staffId && 
      a.date === req.body.date
    );
    
    if (existing) {
      return res.status(400).json({ error: 'Attendance already marked for this date' });
    }
    
    const newRecord = {
      id: uuidv4(),
      ...req.body,
      status: req.body.status || 'present',
      createdAt: new Date().toISOString()
    };
    
    attendance.push(newRecord);
    saveAttendance(attendance);
    res.json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update attendance
router.put('/:id', (req, res) => {
  try {
    const attendance = getAttendance();
    const index = attendance.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    attendance[index] = {
      ...attendance[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    saveAttendance(attendance);
    res.json(attendance[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete attendance
router.delete('/:id', (req, res) => {
  try {
    const attendance = getAttendance();
    const filtered = attendance.filter(a => a.id !== req.params.id);
    if (attendance.length === filtered.length) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    saveAttendance(filtered);
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly summary
router.get('/summary/:staffId/:year/:month', (req, res) => {
  try {
    const { staffId, year, month } = req.params;
    const attendance = getAttendance();
    
    const records = attendance.filter(a => {
      if (a.staffId !== staffId) return false;
      const recordDate = new Date(a.date);
      return recordDate.getMonth() + 1 === parseInt(month) && 
             recordDate.getFullYear() === parseInt(year);
    });
    
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const halfDay = records.filter(r => r.status === 'half-day').length;
    const leave = records.filter(r => r.status === 'leave').length;
    
    res.json({
      staffId,
      year: parseInt(year),
      month: parseInt(month),
      totalRecords: records.length,
      present,
      absent,
      halfDay,
      leave,
      records
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
