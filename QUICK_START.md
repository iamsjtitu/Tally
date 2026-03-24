# 🚀 Quick Start Guide - Tally Clone

## तुरंत शुरू करें (Hindi)

### 1. Backend Server Start करें

```bash
cd /app/desktop
node web_server.js
```

**या** helper script use करें:
```bash
/app/start-server.sh
```

Server चल गया! अब आप browser में खोल सकते हैं।

### 2. Browser में खोलें

```
http://localhost:8765
```

### 3. Company बनाएं

1. "Company Info" पर click करें (या `Alt+C` press करें)
2. "Create New Company" पर click करें
3. Details भरें:
   - Company Name (required)
   - Address
   - City, State
   - GST Number
   - Financial Year
   - Books Beginning Date
4. "Save Company" पर click करें

✅ Company बन गई!

### 4. Ledger बनाएं

1. Company select करें
2. "Masters" पर click करें (या `Alt+L`)
3. "Create Ledger" पर click करें
4. Details भरें:
   - Ledger Name
   - Group (dropdown से select करें)
   - Type (Debit/Credit)
   - Opening Balance
5. "Save Ledger" पर click करें

### 5. Voucher Entry करें

1. "Voucher Entry" पर जाएं (या `Alt+V`)
2. Voucher Type select करें (Receipt, Payment, Journal, etc.)
3. Date select करें
4. Entries add करें:
   - Ledger select करें
   - Debit या Credit select करें
   - Amount enter करें
   - "Add Entry" से और entries add करें
5. सुनिश्चित करें: Debit Total = Credit Total
6. Narration लिखें
7. "Save Voucher" पर click करें

### 6. Reports देखें

1. "Display Reports" पर जाएं (या `Alt+R`)
2. कोई भी report select करें:
   - **Trial Balance** - सभी ledgers की balance summary
   - **Profit & Loss** - Income vs Expenses
   - **Balance Sheet** - Assets vs Liabilities
   - **Day Book** - Daily transactions
   - **Cash Book** - Cash receipts & payments

---

## Quick Test (English)

### Start Server
```bash
cd /app/desktop && node web_server.js
```

### Open in Browser
```
http://localhost:8765
```

### Test API (Terminal)
```bash
# Health check
curl http://localhost:8765/api/health

# Create company
curl -X POST http://localhost:8765/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "financialYear": "2024-25",
    "booksBeginning": "2024-04-01"
  }'

# Get all companies
curl http://localhost:8765/api/companies
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt+G` | Gateway (Home) |
| `Alt+C` | Companies |
| `Alt+L` | Ledgers |
| `Alt+V` | Voucher Entry |
| `Alt+R` | Reports |
| `Ctrl+S` | Save |
| `Esc` | Cancel |

---

## Common Issues

### Port 8765 already in use?
```bash
# Kill existing process
pkill -f "node web_server.js"

# Or use different port
PORT=8766 node web_server.js
```

### Frontend not loading?
```bash
# Rebuild frontend
cd /app/frontend
yarn build
cp -r build/* /app/desktop/frontend-build/
```

### API errors?
```bash
# Check backend logs
tail -f /tmp/tally-backend.log

# Test API
curl http://localhost:8765/api/health
```

---

## What Works ✅

✅ Company Management  
✅ Ledger Management  
✅ Voucher Entry (All types)  
✅ Trial Balance  
✅ Profit & Loss  
✅ Balance Sheet  
✅ Day Book  
✅ Cash Book  
✅ Double Entry System  
✅ Auto Posting  
✅ Keyboard Shortcuts  

---

## Desktop App

यह web server version है. Desktop app (Electron) बनाने के लिए:

```bash
cd /app/desktop

# Windows .exe
yarn build:win

# Mac .dmg
yarn build:mac

# Both
yarn build:all
```

---

## Data Location

सभी data यहां stored है:
```
/app/desktop/data/
├── companies.json
├── ledgers.json
├── vouchers.json
└── inventory.json
```

**Backup**: इस folder को copy करें

---

## Need Help?

1. Check `/app/PROJECT_SUMMARY.md`
2. Check `/app/SETUP_GUIDE.md`
3. Check `/app/BUGFIX_COMPANY_CREATION.md`

---

**Happy Accounting! 🧮💰**
