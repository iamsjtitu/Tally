const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const VOUCHERS_FILE = path.join(__dirname, '../data/vouchers.json');
const LEDGERS_FILE = path.join(__dirname, '../data/ledgers.json');

function getVouchers() {
  if (!fs.existsSync(VOUCHERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(VOUCHERS_FILE, 'utf8'));
}

function getLedgers() {
  if (!fs.existsSync(LEDGERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(LEDGERS_FILE, 'utf8'));
}

// Trial Balance
router.get('/trial-balance', (req, res) => {
  try {
    const { companyId, fromDate, toDate } = req.query;
    const ledgers = getLedgers().filter(l => !companyId || l.companyId === companyId);
    
    const trialBalance = ledgers.map(ledger => ({
      ledger: ledger.name,
      group: ledger.group,
      debit: ledger.balance >= 0 ? Math.abs(ledger.balance) : 0,
      credit: ledger.balance < 0 ? Math.abs(ledger.balance) : 0
    }));
    
    const totalDebit = trialBalance.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = trialBalance.reduce((sum, item) => sum + item.credit, 0);
    
    res.json({
      data: trialBalance,
      totals: { debit: totalDebit, credit: totalCredit }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profit & Loss Statement
router.get('/profit-loss', (req, res) => {
  try {
    const { companyId, fromDate, toDate } = req.query;
    const ledgers = getLedgers().filter(l => !companyId || l.companyId === companyId);
    
    const income = ledgers
      .filter(l => ['Sales', 'Revenue', 'Income'].includes(l.group))
      .reduce((sum, l) => sum + Math.abs(l.balance), 0);
    
    const expenses = ledgers
      .filter(l => ['Expenses', 'Purchase', 'Cost'].includes(l.group))
      .reduce((sum, l) => sum + Math.abs(l.balance), 0);
    
    const profit = income - expenses;
    
    res.json({
      income,
      expenses,
      profit,
      profitPercent: income > 0 ? ((profit / income) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Balance Sheet
router.get('/balance-sheet', (req, res) => {
  try {
    const { companyId, asOnDate } = req.query;
    const ledgers = getLedgers().filter(l => !companyId || l.companyId === companyId);
    
    const assets = ledgers
      .filter(l => ['Assets', 'Fixed Assets', 'Current Assets', 'Bank', 'Cash'].includes(l.group))
      .reduce((sum, l) => sum + Math.abs(l.balance), 0);
    
    const liabilities = ledgers
      .filter(l => ['Liabilities', 'Current Liabilities', 'Loans', 'Capital'].includes(l.group))
      .reduce((sum, l) => sum + Math.abs(l.balance), 0);
    
    res.json({
      assets,
      liabilities,
      difference: assets - liabilities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Day Book
router.get('/day-book', (req, res) => {
  try {
    const { companyId, date } = req.query;
    let vouchers = getVouchers();
    
    if (companyId) {
      vouchers = vouchers.filter(v => v.companyId === companyId);
    }
    
    if (date) {
      const targetDate = new Date(date).toDateString();
      vouchers = vouchers.filter(v => new Date(v.date).toDateString() === targetDate);
    }
    
    vouchers.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cash Book
router.get('/cash-book', (req, res) => {
  try {
    const { companyId, fromDate, toDate } = req.query;
    const vouchers = getVouchers().filter(v => {
      if (companyId && v.companyId !== companyId) return false;
      if (fromDate && new Date(v.date) < new Date(fromDate)) return false;
      if (toDate && new Date(v.date) > new Date(toDate)) return false;
      return v.type === 'Receipt' || v.type === 'Payment';
    });
    
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ledger Report
router.get('/ledger/:ledgerId', (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const { ledgerId } = req.params;
    
    const vouchers = getVouchers().filter(v => {
      const hasLedger = v.entries.some(e => e.ledgerId === ledgerId);
      if (!hasLedger) return false;
      if (fromDate && new Date(v.date) < new Date(fromDate)) return false;
      if (toDate && new Date(v.date) > new Date(toDate)) return false;
      return true;
    });
    
    let balance = 0;
    const transactions = vouchers.map(v => {
      const entry = v.entries.find(e => e.ledgerId === ledgerId);
      if (entry.type === 'debit') {
        balance += parseFloat(entry.amount);
      } else {
        balance -= parseFloat(entry.amount);
      }
      
      return {
        date: v.date,
        voucherNumber: v.voucherNumber,
        type: v.type,
        particulars: v.narration,
        debit: entry.type === 'debit' ? entry.amount : 0,
        credit: entry.type === 'credit' ? entry.amount : 0,
        balance
      };
    });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
