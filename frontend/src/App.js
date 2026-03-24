import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Gateway from './pages/Gateway';
import CompanyList from './pages/CompanyList';
import CreateCompany from './pages/CreateCompany';
import LedgerList from './pages/LedgerList';
import CreateLedger from './pages/CreateLedger';
import VoucherEntry from './pages/VoucherEntry';
import Reports from './pages/Reports';
import TrialBalance from './pages/reports/TrialBalance';
import ProfitLoss from './pages/reports/ProfitLoss';
import BalanceSheet from './pages/reports/BalanceSheet';
import DayBook from './pages/reports/DayBook';
import CashBook from './pages/reports/CashBook';
import LedgerReport from './pages/reports/LedgerReport';
import './App.css';

function App() {
  const [currentCompany, setCurrentCompany] = useState(null);

  useEffect(() => {
    const savedCompany = localStorage.getItem('currentCompany');
    if (savedCompany) {
      setCurrentCompany(JSON.parse(savedCompany));
    }
  }, []);

  const selectCompany = (company) => {
    setCurrentCompany(company);
    localStorage.setItem('currentCompany', JSON.stringify(company));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Gateway company={currentCompany} />} />
          <Route path="/companies" element={<CompanyList onSelect={selectCompany} />} />
          <Route path="/companies/create" element={<CreateCompany />} />
          <Route path="/ledgers" element={<LedgerList company={currentCompany} />} />
          <Route path="/ledgers/create" element={<CreateLedger company={currentCompany} />} />
          <Route path="/vouchers/:type" element={<VoucherEntry company={currentCompany} />} />
          <Route path="/reports" element={<Reports company={currentCompany} />} />
          <Route path="/reports/trial-balance" element={<TrialBalance company={currentCompany} />} />
          <Route path="/reports/profit-loss" element={<ProfitLoss company={currentCompany} />} />
          <Route path="/reports/balance-sheet" element={<BalanceSheet company={currentCompany} />} />
          <Route path="/reports/day-book" element={<DayBook company={currentCompany} />} />
          <Route path="/reports/cash-book" element={<CashBook company={currentCompany} />} />
          <Route path="/reports/ledger/:ledgerId" element={<LedgerReport company={currentCompany} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
