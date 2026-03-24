const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/salary_payments.json');
const VOUCHERS_FILE = path.join(__dirname, '../data/vouchers.json');
const LEDGERS_FILE = path.join(__dirname, '../data/ledgers.json');

function getSalaryPayments() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveSalaryPayments(payments) {
  fs.ensureDirSync(path.dirname(DATA_FILE));
  fs.writeFileSync(DATA_FILE, JSON.stringify(payments, null, 2));
}

function getVouchers() {
  if (!fs.existsSync(VOUCHERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(VOUCHERS_FILE, 'utf8'));
}

function saveVouchers(vouchers) {
  fs.writeFileSync(VOUCHERS_FILE, JSON.stringify(vouchers, null, 2));
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

// Get salary payments
router.get('/', (req, res) => {
  try {
    const payments = getSalaryPayments();
    const { companyId, staffId, month, year } = req.query;
    
    let filtered = payments;
    if (companyId) {
      filtered = filtered.filter(p => p.companyId === companyId);
    }
    if (staffId) {
      filtered = filtered.filter(p => p.staffId === staffId);
    }
    if (month && year) {
      filtered = filtered.filter(p => p.month === parseInt(month) && p.year === parseInt(year));
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pay salary
router.post('/', (req, res) => {
  try {
    const { companyId, staffId, staffName, month, year, amount, paymentDate, notes } = req.body;
    
    // Check if already paid for this month
    const payments = getSalaryPayments();
    const existing = payments.find(p => 
      p.staffId === staffId && 
      p.month === month && 
      p.year === year
    );
    
    if (existing) {
      return res.status(400).json({ error: 'Salary already paid for this month' });
    }
    
    // Get ledgers
    const ledgers = getLedgers();
    
    // Find or create Salary Expense ledger
    let salaryExpenseLedger = ledgers.find(l => 
      l.companyId === companyId && 
      l.name === 'Salary Expense'
    );
    
    if (!salaryExpenseLedger) {
      salaryExpenseLedger = {
        id: uuidv4(),
        companyId,
        name: 'Salary Expense',
        group: 'Expenses (Indirect)',
        type: 'Debit',
        openingBalance: 0,
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      ledgers.push(salaryExpenseLedger);
    }
    
    // Find Cash account
    let cashLedger = ledgers.find(l => 
      l.companyId === companyId && 
      l.name === 'Cash'
    );
    
    if (!cashLedger) {
      cashLedger = {
        id: uuidv4(),
        companyId,
        name: 'Cash',
        group: 'Cash-in-Hand',
        type: 'Debit',
        openingBalance: 0,
        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      ledgers.push(cashLedger);
    }
    
    // Update ledger balances
    salaryExpenseLedger.balance = (parseFloat(salaryExpenseLedger.balance) || 0) + parseFloat(amount);
    cashLedger.balance = (parseFloat(cashLedger.balance) || 0) - parseFloat(amount);
    saveLedgers(ledgers);
    
    // Create voucher entry
    const vouchers = getVouchers();
    const voucher = {
      id: uuidv4(),
      companyId,
      type: 'Payment',
      date: paymentDate,
      voucherNumber: `SAL${Date.now()}`,
      narration: `Salary payment for ${staffName} - ${getMonthName(month)} ${year}`,
      entries: [
        {
          ledgerId: salaryExpenseLedger.id,
          ledgerName: 'Salary Expense',
          type: 'debit',
          amount: parseFloat(amount)
        },
        {
          ledgerId: cashLedger.id,
          ledgerName: 'Cash',
          type: 'credit',
          amount: parseFloat(amount)
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    vouchers.push(voucher);
    saveVouchers(vouchers);
    
    // Create salary payment record
    const payment = {
      id: uuidv4(),
      companyId,
      staffId,
      staffName,
      month,
      year,
      amount: parseFloat(amount),
      paymentDate,
      voucherId: voucher.id,
      voucherNumber: voucher.voucherNumber,
      notes: notes || '',
      status: 'paid',
      createdAt: new Date().toISOString()
    };
    
    payments.push(payment);
    saveSalaryPayments(payments);
    
    res.json({
      payment,
      voucher,
      message: 'Salary paid successfully and voucher created'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment by ID
router.get('/:id', (req, res) => {
  try {
    const payments = getSalaryPayments();
    const payment = payments.find(p => p.id === req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function
function getMonthName(month) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
}

module.exports = router;
