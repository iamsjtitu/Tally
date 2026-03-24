# 🧮 Tally Accounting Software - Complete Desktop Clone

## Professional Desktop Accounting Application

A complete, feature-rich **Tally ERP clone** built as a desktop application using Electron, React, and Node.js. Supports Windows (.exe) and Mac (.dmg) with auto-update functionality from GitHub releases.

---

## ✨ Features

### 📊 Accounting Features
- ✅ **Multi-Company Management** - Create and manage multiple companies
- ✅ **Ledger Management** - Create ledgers with 17+ predefined groups
- ✅ **Double Entry System** - Automatic posting and balance updates
- ✅ **Voucher Entry** - Receipt, Payment, Journal, Contra, Sales, Purchase
- ✅ **GST/Tax Support** - GST number, PAN tracking
- ✅ **Financial Year Management** - Multiple FY support

### 📈 Reports
- ✅ **Trial Balance** - Complete ledger balance summary
- ✅ **Profit & Loss Statement** - Income vs Expenses analysis
- ✅ **Balance Sheet** - Assets and Liabilities
- ✅ **Day Book** - Daily transaction register
- ✅ **Cash Book** - Cash receipts and payments
- ✅ **Ledger Report** - Individual ledger statements

### 💻 Desktop Features
- ✅ **Cross-Platform** - Windows & Mac support
- ✅ **Offline First** - No internet required for operation
- ✅ **Local Storage** - JSON-based file storage (no database install needed)
- ✅ **Auto-Update** - Automatic updates from GitHub releases
- ✅ **System Tray** - Minimize to tray functionality
- ✅ **Keyboard Shortcuts** - Tally-style shortcuts (Alt+G, Alt+C, etc.)

---

## 🚀 Quick Start

### For Users

**Download Installers:**

1. Go to [Releases](https://github.com/iamsjtitu/Tally-Clone/releases)
2. Download for your platform:
   - **Windows**: `Tally-Accounting-Setup-1.0.0.exe`
   - **Mac**: `Tally-Accounting-1.0.0.dmg`
3. Install and run!

### For Developers

**Prerequisites:**
- Node.js 18+
- Yarn package manager

**Installation:**

```bash
# Clone repository
git clone https://github.com/iamsjtitu/Tally-Clone.git
cd Tally-Clone

# Install & build frontend
cd frontend
yarn install
yarn build

# Copy to desktop
cp -r build ../desktop/frontend-build

# Install & run desktop app
cd ../desktop
yarn install
yarn start
```

See `desktop/README.md` and `desktop/BUILD_GUIDE.md` for detailed instructions.

---

## 📦 Building Installers

```bash
cd desktop
yarn build:win    # Windows .exe
yarn build:mac    # Mac .dmg
yarn build:all    # Both platforms
```

---

## 🔄 Auto-Update from GitHub

1. Create GitHub repo and push code
2. Generate GitHub token (Settings → Developer → Tokens)
3. Set `GH_TOKEN` environment variable
4. Update `desktop/package.json` with your repo details
5. Build & publish: `yarn publish:all`
6. GitHub Actions auto-builds on tag push: `git tag v1.0.0 && git push --tags`

See `desktop/README.md` for complete setup guide.

---

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+G` | Gateway (Home) |
| `Alt+C` | Companies |
| `Alt+L` | Ledgers |
| `Alt+V` | Voucher Entry |
| `Alt+R` | Reports |
| `Ctrl+S` | Save |
| `Esc` | Cancel/Back |

---

## 📁 Project Structure

```
Tally-Clone/
├── desktop/           # Electron app + Node.js backend
│   ├── main.js
│   ├── web_server.js
│   ├── routes/       # API endpoints
│   └── data/         # JSON storage
├── frontend/         # React UI
│   └── src/pages/    # All pages & reports
└── .github/workflows/ # Auto-build CI/CD
```

---

## 🛠️ Technology Stack

- **Frontend**: React 19, React Router, Lucide Icons
- **Backend**: Node.js, Express, JSON file storage
- **Desktop**: Electron 28, electron-builder, electron-updater

---

## 📖 Usage

1. **Create Company**: Alt+C → Create New Company
2. **Create Ledgers**: Alt+L → Create Ledger
3. **Enter Vouchers**: Alt+V → Select type → Add entries
4. **View Reports**: Alt+R → Select report

---

## 🎯 Roadmap

**v1.0 (Current)** ✅  
Basic accounting, vouchers, reports, desktop app, auto-update

**v1.1** (Next)  
GST returns, e-invoice, advanced inventory, multi-currency

**v1.2** (Future)  
Payroll, banking integration, mobile app, cloud sync

---

## 🐛 Troubleshooting

**App won't start?**
```bash
node --version  # Check Node.js 18+
cd desktop && yarn install
```

**Build issues?**
- Windows: `npm install --global windows-build-tools`
- Mac: `xcode-select --install`

**Mac "App is damaged":**
```bash
xattr -cr "/Applications/Tally Accounting Software.app"
```

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🤝 Contributing

Contributions welcome! Fork, create feature branch, and open PR.

---

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/iamsjtitu/Tally-Clone/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/iamsjtitu/Tally-Clone/discussions)

---

**⭐ Star this repo if you found it helpful!**

**Built with ❤️ using Electron, React & Node.js**
