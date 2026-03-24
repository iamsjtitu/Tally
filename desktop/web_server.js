const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 8765;

const DATA_DIR = path.join(__dirname, 'data');
fs.ensureDirSync(DATA_DIR);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.static(path.join(__dirname, 'frontend-build')));

const companiesRouter = require('./routes/companies');
const ledgersRouter = require('./routes/ledgers');
const vouchersRouter = require('./routes/vouchers');
const reportsRouter = require('./routes/reports');
const inventoryRouter = require('./routes/inventory');
const staffRouter = require('./routes/staff');
const attendanceRouter = require('./routes/attendance');
const salaryRouter = require('./routes/salary');

app.use('/api/companies', companiesRouter);
app.use('/api/ledgers', ledgersRouter);
app.use('/api/vouchers', vouchersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/staff', staffRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/salary', salaryRouter);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Tally Accounting Server Running',
    dataDir: DATA_DIR,
    timestamp: new Date().toISOString()
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});

module.exports = { DATA_DIR, app };
