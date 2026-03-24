const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/companies.json');

function getCompanies() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveCompanies(companies) {
  fs.ensureDirSync(path.dirname(DATA_FILE));
  fs.writeFileSync(DATA_FILE, JSON.stringify(companies, null, 2));
}

router.get('/', (req, res) => {
  try {
    const companies = getCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const companies = getCompanies();
    const newCompany = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    companies.push(newCompany);
    saveCompanies(companies);
    res.json(newCompany);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const companies = getCompanies();
    const company = companies.find(c => c.id === req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const companies = getCompanies();
    const index = companies.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Company not found' });
    }
    companies[index] = {
      ...companies[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    saveCompanies(companies);
    res.json(companies[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const companies = getCompanies();
    const filtered = companies.filter(c => c.id !== req.params.id);
    if (companies.length === filtered.length) {
      return res.status(404).json({ error: 'Company not found' });
    }
    saveCompanies(filtered);
    res.json({ message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
