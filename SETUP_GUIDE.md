# 🚀 Tally Clone - Complete Setup Guide

## आपका Tally Desktop Application तैयार है! 🎉

---

## ✅ क्या-क्या बना है?

### 1. Desktop Application (Electron)
- ✅ `desktop/main.js` - Electron main process with auto-update
- ✅ `desktop/web_server.js` - Node.js Express backend (port 8765)
- ✅ `desktop/preload.js` - Secure IPC communication
- ✅ `desktop/package.json` - electron-builder configuration

### 2. Backend API Routes (Node.js + Express)
- ✅ `/api/companies` - Company management
- ✅ `/api/ledgers` - Ledger CRUD operations
- ✅ `/api/vouchers` - Voucher entry (auto posting)
- ✅ `/api/inventory` - Stock management
- ✅ `/api/reports` - All Tally reports
  - Trial Balance
  - Profit & Loss
  - Balance Sheet
  - Day Book
  - Cash Book
  - Ledger Report

### 3. Frontend (React 19)
- ✅ Gateway - Tally-style main menu
- ✅ Company Management - Create, select, delete
- ✅ Ledger Management - 17+ predefined groups
- ✅ Voucher Entry - Receipt, Payment, Journal, Contra, Sales, Purchase
- ✅ All Reports - Professional Tally-style reports
- ✅ Keyboard Shortcuts - Alt+G, Alt+C, Alt+L, etc.

### 4. Features
- ✅ Double Entry Accounting System
- ✅ Auto Posting & Balance Updates
- ✅ Local JSON File Storage (No DB needed)
- ✅ Multi-Company Support
- ✅ GST/Tax Support
- ✅ Financial Year Management
- ✅ .exe (Windows) & .dmg (Mac) Build Configuration
- ✅ Auto-Update from GitHub Releases
- ✅ System Tray Integration

### 5. Documentation
- ✅ `desktop/README.md` - Complete user & developer guide
- ✅ `desktop/BUILD_GUIDE.md` - Step-by-step build instructions
- ✅ `TALLY_README.md` - Main project README
- ✅ `.github/workflows/build.yml` - GitHub Actions CI/CD

---

## 🏃 कैसे चलाएं (Development Mode)

### Step 1: Frontend Build करें

```bash
cd /app/frontend

# Install dependencies (if not already installed)
yarn install

# Build frontend
yarn build

# Copy build to desktop folder
mkdir -p ../desktop/frontend-build
cp -r build/* ../desktop/frontend-build/
```

### Step 2: Desktop App चलाएं

```bash
cd /app/desktop

# Install dependencies (if not already installed)
yarn install

# Start desktop app
yarn start
```

**App खुल जाएगा! 🎉**

---

## 📦 Installers कैसे बनाएं?

### Windows (.exe) Build

```bash
cd /app/desktop

# Build Windows installer
yarn build:win

# Output: desktop/dist/Tally-Accounting-Setup-1.0.0.exe
```

### Mac (.dmg) Build

```bash
cd /app/desktop

# Build Mac installer
yarn build:mac

# Output: desktop/dist/Tally-Accounting-1.0.0.dmg
```

### Both Platforms

```bash
cd /app/desktop
yarn build:all
```

---

## 🔄 GitHub Auto-Update Setup

### 1. GitHub Repository बनाएं

```bash
# Initialize git (if not done)
cd /app
git init
git add .
git commit -m "Initial commit: Tally Clone Desktop App"

# Create repository on GitHub
# Then add remote
git remote add origin https://github.com/YOUR_USERNAME/Tally-Clone.git
git branch -M main
git push -u origin main
```

### 2. GitHub Token Generate करें

1. GitHub पर जाएं: Settings → Developer settings → Personal access tokens
2. "Generate new token (classic)" पर click करें
3. Scope में `repo` (full control) select करें
4. Token copy करें

### 3. Environment Variable Set करें

**Windows:**
```cmd
setx GH_TOKEN "your_github_token_here"
```

**Mac/Linux:**
```bash
export GH_TOKEN="your_github_token_here"
```

### 4. package.json Update करें

File: `/app/desktop/package.json`

```json
"publish": [{
  "provider": "github",
  "owner": "YOUR_GITHUB_USERNAME",
  "repo": "Tally-Clone"
}]
```

### 5. Publish करें

```bash
# Version update करें
# Edit desktop/package.json: "version": "1.1.0"

cd /app/desktop

# Build and publish to GitHub
yarn publish:all

# या GitHub Actions use करें
cd /app
git tag v1.0.0
git push --tags
```

GitHub Actions automatically .exe और .dmg build करके release में upload कर देगा!

---

## 🎮 App कैसे Use करें?

### Company बनाएं

1. App launch करें
2. "Company Info" पर click या `Alt+C` press करें
3. "Create New Company" पर click करें
4. Details भरें (Name, Address, GST, etc.)
5. Save करें

### Ledger बनाएं

1. Company select करें
2. "Masters" पर जाएं या `Alt+L` press करें
3. "Create Ledger" पर click करें
4. Ledger name, group, type select करें
5. Opening balance enter करें
6. Save करें

### Voucher Entry करें

1. "Voucher Entry" पर जाएं या `Alt+V` press करें
2. Voucher type select करें (Receipt/Payment/Journal etc.)
3. Entries add करें:
   - Ledger select करें
   - Debit/Credit select करें
   - Amount enter करें
4. सुनिश्चित करें: **Debit Total = Credit Total**
5. Narration add करें
6. Save करें

### Reports देखें

1. "Display Reports" पर जाएं या `Alt+R` press करें
2. Report select करें:
   - Trial Balance
   - Profit & Loss
   - Balance Sheet
   - Day Book
   - Cash Book
3. View, Print, या Export करें

---

## 🎯 Architecture

```
Desktop App (Electron)
    ↓
Electron Main Process (main.js)
    ↓
    ├─→ Frontend (React) - port 3000 (dev) / embedded (production)
    │       ↓
    │   Gateway → Companies → Ledgers → Vouchers → Reports
    │
    └─→ Backend (Node.js Express) - port 8765
            ↓
        API Routes → JSON File Storage
        (companies.json, ledgers.json, vouchers.json)
```

**Data Storage Location:**
- Windows: `%APPDATA%/tally-clone/data/`
- Mac: `~/Library/Application Support/tally-clone/data/`

---

## ⚡ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Alt+G` | Gateway (Home) |
| `Alt+C` | Companies |
| `Alt+L` | Ledgers |
| `Alt+V` | Voucher Entry |
| `Alt+R` | Reports |
| `Ctrl+S` | Save (in forms) |
| `Esc` | Cancel/Back |
| `Ctrl+A` | Add Entry (in voucher) |

---

## 🐛 Troubleshooting

### App नहीं चल रहा?

```bash
# Node.js check करें
node --version  # 18+ होना चाहिए

# Dependencies reinstall करें
cd /app/desktop
rm -rf node_modules
yarn install
```

### Frontend build नहीं हो रहा?

```bash
cd /app/frontend
rm -rf node_modules build
yarn install
yarn build
```

### Backend error आ रहा है?

```bash
# Port 8765 available है check करें
lsof -i :8765  # Mac/Linux
netstat -ano | findstr :8765  # Windows

# Data directory create करें
mkdir -p /app/desktop/data
```

---

## 📂 Important Files

```
/app/
├── desktop/
│   ├── main.js              # Electron entry point
│   ├── web_server.js        # Backend server
│   ├── package.json         # Build config
│   ├── routes/              # API endpoints
│   ├── data/                # JSON storage
│   └── frontend-build/      # React build (copy from frontend/build)
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── pages/           # All pages
│   └── build/               # Production build
│
└── .github/workflows/
    └── build.yml            # Auto-build on tag push
```

---

## 🎨 UI Theme

Tally-style professional theme:
- Primary Color: #0066cc (Tally Blue)
- Header: Linear gradient blue
- Keyboard shortcuts displayed
- Professional tables and forms
- Responsive design

---

## 🚀 Next Steps

1. ✅ **Test the app** - Run in development mode
2. ✅ **Build installer** - Create .exe or .dmg
3. ✅ **Push to GitHub** - Version control
4. ✅ **Setup auto-update** - GitHub releases
5. ✅ **Distribute** - Share with users!

---

## 📝 Notes

- **Data Safety**: सभी data local JSON files में stored है
- **Backup**: `desktop/data/` folder को regularly backup करें
- **Updates**: GitHub releases से automatically update होता है
- **Offline**: Internet connection की ज़रूरत नहीं (except updates)

---

## 🎉 Congratulations!

आपका **Complete Tally Desktop Application** ready है! 

**Features:**
✅ Full Tally-like accounting
✅ Windows & Mac support
✅ Auto-update
✅ Professional UI
✅ Complete reports
✅ Local storage

**Happy Accounting! 🧮💰**
