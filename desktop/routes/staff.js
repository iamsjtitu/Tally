const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/staff.json');

function getStaff() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveStaff(staff) {
  fs.ensureDirSync(path.dirname(DATA_FILE));
  fs.writeFileSync(DATA_FILE, JSON.stringify(staff, null, 2));
}

// Get all staff
router.get('/', (req, res) => {
  try {
    const staff = getStaff();
    const { companyId, status } = req.query;
    
    let filtered = staff;
    if (companyId) {
      filtered = filtered.filter(s => s.companyId === companyId);
    }
    if (status) {
      filtered = filtered.filter(s => s.status === status);
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create staff
router.post('/', (req, res) => {
  try {
    const staff = getStaff();
    const newStaff = {
      id: uuidv4(),
      ...req.body,
      monthlySalary: parseFloat(req.body.monthlySalary) || 10000,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    staff.push(newStaff);
    saveStaff(staff);
    res.json(newStaff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single staff
router.get('/:id', (req, res) => {
  try {
    const staff = getStaff();
    const member = staff.find(s => s.id === req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update staff
router.put('/:id', (req, res) => {
  try {
    const staff = getStaff();
    const index = staff.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    staff[index] = {
      ...staff[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    saveStaff(staff);
    res.json(staff[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete staff
router.delete('/:id', (req, res) => {
  try {
    const staff = getStaff();
    const filtered = staff.filter(s => s.id !== req.params.id);
    if (staff.length === filtered.length) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    saveStaff(filtered);
    res.json({ message: 'Staff deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
