const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/ledgers.json');

function getLedgers() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveLedgers(ledgers) {
  fs.ensureDirSync(path.dirname(DATA_FILE));
  fs.writeFileSync(DATA_FILE, JSON.stringify(ledgers, null, 2));
}

router.get('/', (req, res) => {
  try {
    const ledgers = getLedgers();
    const { companyId, group, type } = req.query;
    
    let filtered = ledgers;
    if (companyId) {
      filtered = filtered.filter(l => l.companyId === companyId);
    }
    if (group) {
      filtered = filtered.filter(l => l.group === group);
    }
    if (type) {
      filtered = filtered.filter(l => l.type === type);
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const ledgers = getLedgers();
    const newLedger = {
      id: uuidv4(),
      ...req.body,
      balance: req.body.openingBalance || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    ledgers.push(newLedger);
    saveLedgers(ledgers);
    res.json(newLedger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const ledgers = getLedgers();
    const ledger = ledgers.find(l => l.id === req.params.id);
    if (!ledger) {
      return res.status(404).json({ error: 'Ledger not found' });
    }
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const ledgers = getLedgers();
    const index = ledgers.findIndex(l => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Ledger not found' });
    }
    ledgers[index] = {
      ...ledgers[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    saveLedgers(ledgers);
    res.json(ledgers[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const ledgers = getLedgers();
    const filtered = ledgers.filter(l => l.id !== req.params.id);
    if (ledgers.length === filtered.length) {
      return res.status(404).json({ error: 'Ledger not found' });
    }
    saveLedgers(filtered);
    res.json({ message: 'Ledger deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
