const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/vouchers.json');
const LEDGERS_FILE = path.join(__dirname, '../data/ledgers.json');

function getVouchers() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveVouchers(vouchers) {
  fs.ensureDirSync(path.dirname(DATA_FILE));
  fs.writeFileSync(DATA_FILE, JSON.stringify(vouchers, null, 2));
}

function getLedgers() {
  if (!fs.existsSync(LEDGERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(LEDGERS_FILE, 'utf8'));
}

function saveLedgers(ledgers) {
  fs.writeFileSync(LEDGERS_FILE, JSON.stringify(ledgers, null, 2));
}

function updateLedgerBalances(voucher, isDelete = false) {
  const ledgers = getLedgers();
  const multiplier = isDelete ? -1 : 1;
  
  voucher.entries.forEach(entry => {
    const ledger = ledgers.find(l => l.id === entry.ledgerId);
    if (ledger) {
      if (entry.type === 'debit') {
        ledger.balance = (parseFloat(ledger.balance) || 0) + (parseFloat(entry.amount) * multiplier);
      } else {
        ledger.balance = (parseFloat(ledger.balance) || 0) - (parseFloat(entry.amount) * multiplier);
      }
    }
  });
  
  saveLedgers(ledgers);
}

router.get('/', (req, res) => {
  try {
    const vouchers = getVouchers();
    const { companyId, type, fromDate, toDate } = req.query;
    
    let filtered = vouchers;
    if (companyId) {
      filtered = filtered.filter(v => v.companyId === companyId);
    }
    if (type) {
      filtered = filtered.filter(v => v.type === type);
    }
    if (fromDate) {
      filtered = filtered.filter(v => new Date(v.date) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(v => new Date(v.date) <= new Date(toDate));
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const vouchers = getVouchers();
    const newVoucher = {
      id: uuidv4(),
      ...req.body,
      voucherNumber: req.body.voucherNumber || `V${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    updateLedgerBalances(newVoucher);
    
    vouchers.push(newVoucher);
    saveVouchers(vouchers);
    res.json(newVoucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const vouchers = getVouchers();
    const voucher = vouchers.find(v => v.id === req.params.id);
    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found' });
    }
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const vouchers = getVouchers();
    const index = vouchers.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Voucher not found' });
    }
    
    updateLedgerBalances(vouchers[index], true);
    
    vouchers[index] = {
      ...vouchers[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    updateLedgerBalances(vouchers[index]);
    
    saveVouchers(vouchers);
    res.json(vouchers[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const vouchers = getVouchers();
    const voucher = vouchers.find(v => v.id === req.params.id);
    if (!voucher) {
      return res.status(404).json({ error: 'Voucher not found' });
    }
    
    updateLedgerBalances(voucher, true);
    
    const filtered = vouchers.filter(v => v.id !== req.params.id);
    saveVouchers(filtered);
    res.json({ message: 'Voucher deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
