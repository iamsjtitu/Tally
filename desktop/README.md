# 🧾 Tally Accounting Software - Desktop Clone

## Complete Tally ERP Alternative - 100% Free & Open Source

### ✨ Features

**📊 Accounting Module**
- ✅ Company Management (Multiple Companies)
- ✅ Ledger Creation & Management (All Groups)
- ✅ Voucher Entry (Receipt, Payment, Journal, Contra, Sales, Purchase)
- ✅ Auto Posting & Double Entry System
- ✅ GST/Tax Support

**📈 Reports**
- ✅ Trial Balance
- ✅ Profit & Loss Statement
- ✅ Balance Sheet
- ✅ Day Book
- ✅ Cash Book
- ✅ Bank Book
- ✅ Ledger Report
- ✅ Stock Summary

**📦 Inventory Management**
- ✅ Stock Items
- ✅ Stock Groups
- ✅ Units of Measure
- ✅ Purchase & Sales Tracking
- ✅ Stock Valuation

**💾 Data Storage**
- ✅ Local JSON File Storage (No MongoDB needed)
- ✅ Automatic Backups
- ✅ Data Export/Import
- ✅ Multi-Company Data Isolation

**🖥️ Desktop Features**
- ✅ Windows (.exe) & Mac (.dmg) Installers
- ✅ Offline Operation
- ✅ Auto-Update from GitHub
- ✅ System Tray Integration
- ✅ Keyboard Shortcuts (Tally-style)

---

## 🚀 Quick Start

### For Users (Installers)

**Windows:**
1. Download `Tally-Accounting-Setup-1.0.0.exe` from [Releases](https://github.com/iamsjtitu/Tally-Clone/releases)
2. Run installer
3. Launch from Desktop/Start Menu

**Mac:**
1. Download `Tally-Accounting-1.0.0.dmg` from [Releases](https://github.com/iamsjtitu/Tally-Clone/releases)
2. Open DMG and drag to Applications
3. Launch from Applications folder

---

## 🛠️ For Developers

### Prerequisites

- **Node.js 18+** (nodejs.org)
- **Yarn** package manager

### Installation

```bash
# Clone repository
git clone https://github.com/iamsjtitu/Tally-Clone.git
cd Tally-Clone

# Install frontend dependencies
cd frontend
yarn install

# Build frontend
yarn build

# Copy build to desktop folder
cp -r build ../desktop/frontend-build

# Install desktop dependencies
cd ../desktop
yarn install

# Run application
yarn start
```

### Development Mode

```bash
# Terminal 1: Frontend (with hot reload)
cd frontend
yarn start

# Terminal 2: Desktop app (development mode)
cd desktop
NODE_ENV=development yarn start
```

---

## 📦 Building Installers

### Windows (.exe)

```bash
cd desktop
yarn build:win

# Output: desktop/dist/Tally-Accounting-Setup-1.0.0.exe
```

### Mac (.dmg)

```bash
cd desktop
yarn build:mac

# Output: desktop/dist/Tally-Accounting-1.0.0.dmg
```

### Both Platforms

```bash
cd desktop
yarn build:all
```

---

## 🔄 Auto-Update Setup (GitHub Releases)

### 1. Create GitHub Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/Tally-Clone.git
git push -u origin main
```

### 2. Generate GitHub Token

1. Go to: Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scope: `repo` (full control)
4. Copy token

### 3. Set Environment Variable

**Windows:**
```cmd
setx GH_TOKEN "your_github_token_here"
```

**Mac/Linux:**
```bash
export GH_TOKEN="your_github_token_here"
```

### 4. Update package.json

Edit `desktop/package.json`:

```json
"publish": [{
  "provider": "github",
  "owner": "YOUR_USERNAME",
  "repo": "Tally-Clone"
}]
```

### 5. Publish New Version

```bash
# Update version in desktop/package.json
# Example: "version": "1.1.0"

# Build and publish
cd desktop
yarn publish:all  # or publish:win / publish:mac

# This will:
# 1. Build installers
# 2. Create GitHub Release (draft)
# 3. Upload .exe and .dmg files
```

### 6. Publish Release

1. Go to GitHub → Releases
2. Edit the draft release
3. Add release notes
4. Click "Publish Release"

### 7. Auto-Update in Action

- App checks for updates on startup
- User gets notification if update available
- Click to download & install
- App restarts with new version! 🎉

---

## 🤖 GitHub Actions (CI/CD)

### Automatic Building

GitHub Actions automatically builds installers when you push a tag:

```bash
# Create and push tag
git tag v1.0.0
git push --tags

# GitHub Actions will:
# 1. Build Windows installer (.exe)
# 2. Build Mac installer (.dmg)
# 3. Create draft release
# 4. Upload installers
```

**Workflow file:** `.github/workflows/build.yml`

---

## 📁 Project Structure

```
Tally-Clone/
├── desktop/                    # Electron desktop app
│   ├── main.js                # Main Electron process
│   ├── preload.js             # Preload script
│   ├── web_server.js          # Node.js backend
│   ├── routes/                # API routes
│   │   ├── companies.js
│   │   ├── ledgers.js
│   │   ├── vouchers.js
│   │   ├── inventory.js
│   │   └── reports.js
│   ├── data/                  # Local JSON storage
│   ├── frontend-build/        # React build files
│   └── package.json
│
├── frontend/                  # React app
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
└── .github/workflows/         # CI/CD
    └── build.yml
```

---

## 🎯 Roadmap

### v1.0 (Current)
- ✅ Basic Accounting
- ✅ Voucher Entry
- ✅ Essential Reports
- ✅ Desktop App
- ✅ Auto-Update

### v1.1 (Next)
- [ ] GST Returns
- [ ] E-Invoice
- [ ] Advanced Inventory
- [ ] Multi-Currency
- [ ] Backup to Cloud

### v1.2 (Future)
- [ ] Payroll Module
- [ ] Banking Integration
- [ ] Mobile App
- [ ] Cloud Sync
- [ ] Audit Trail

---

## 🔧 Troubleshooting

### App won't start?

**Check Node.js:**
```bash
node --version  # Should be 18+
```

**Reinstall dependencies:**
```bash
cd desktop
rm -rf node_modules
yarn install
```

### Build failed?

**Windows:** Install Windows Build Tools
```bash
npm install --global windows-build-tools
```

**Mac:** Install Xcode Command Line Tools
```bash
xcode-select --install
```

### Mac: "App is damaged"

```bash
xattr -cr "/Applications/Tally Accounting Software.app"
```

### Windows: SmartScreen warning

Click "More info" → "Run anyway" (app is unsigned)

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🤝 Contributing

Contributions welcome!

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 💬 Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/iamsjtitu/Tally-Clone/issues)
- 💡 Feature requests: [GitHub Discussions](https://github.com/iamsjtitu/Tally-Clone/discussions)
- 📧 Email: support@example.com

---

**Built with ❤️ using Electron, React & Node.js**

**Star ⭐ this repository if you found it helpful!**
