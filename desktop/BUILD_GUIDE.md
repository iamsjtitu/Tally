# 🔨 Building Tally Desktop Application

## Complete Build Guide for Windows & Mac

---

## 📋 Prerequisites

### Common (All Platforms)

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **Yarn**: `npm install -g yarn`
- **Git**: For version control and auto-updates

### Windows Specific

- **Windows 10/11**
- **Windows Build Tools** (optional, for native modules):
  ```cmd
  npm install --global windows-build-tools
  ```

### Mac Specific

- **macOS 10.15+**
- **Xcode Command Line Tools**:
  ```bash
  xcode-select --install
  ```

---

## 🚀 Step-by-Step Build Process

### Step 1: Prepare Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
yarn install

# Build production bundle
yarn build

# This creates: frontend/build/
```

### Step 2: Copy Frontend Build

```bash
# From project root
cp -r frontend/build desktop/frontend-build

# Or on Windows:
xcopy /E /I frontend\build desktop\frontend-build
```

### Step 3: Install Desktop Dependencies

```bash
cd desktop
yarn install
```

### Step 4: Build Installers

#### Windows (.exe)

```bash
cd desktop
yarn build:win

# Output:
# desktop/dist/Tally-Accounting-Setup-1.0.0.exe
```

**Build options:**
- `--win nsis` - NSIS installer (default)
- `--win portable` - Portable version
- `--win msi` - MSI installer

#### Mac (.dmg)

```bash
cd desktop
yarn build:mac

# Output:
# desktop/dist/Tally-Accounting-1.0.0.dmg
```

**Build options:**
- `--mac dmg` - DMG installer (default)
- `--mac pkg` - PKG installer
- `--mac zip` - ZIP archive

#### Both Platforms (Cross-Platform)

```bash
cd desktop
yarn build:all

# Builds both Windows and Mac installers
```

---

## 📦 Understanding electron-builder

### Configuration (package.json)

```json
"build": {
  "appId": "com.tally.accounting",
  "productName": "Tally Accounting Software",
  "directories": {
    "output": "dist",
    "buildResources": "assets"
  },
  "files": [
    "main.js",
    "preload.js",
    "web_server.js",
    "routes/**/*",
    "frontend-build/**/*",
    "data/**/*",
    "node_modules/**/*",
    "assets/**/*"
  ],
  "win": {
    "target": ["nsis"],
    "icon": "assets/icon.png"
  },
  "mac": {
    "target": ["dmg"],
    "category": "public.app-category.finance"
  }
}
```

### Build Process

1. **Prepare**: Collects all files specified in `"files"`
2. **Package**: Creates Electron app bundle
3. **Installer**: Wraps bundle in installer (.exe/.dmg)
4. **Sign** (optional): Code signing for trusted apps

---

## 🔐 Code Signing (Optional)

### Why Code Sign?

- **Windows**: Removes SmartScreen warning
- **Mac**: Allows running without "Open anyway"
- **Trust**: Users trust signed apps more

### Windows Code Signing

1. **Get Certificate**: Purchase from DigiCert, Sectigo, etc.
2. **Set environment variables**:
   ```cmd
   set CSC_LINK=path\to\certificate.pfx
   set CSC_KEY_PASSWORD=your_password
   ```
3. **Build**:
   ```bash
   yarn build:win
   ```

### Mac Code Signing

1. **Join Apple Developer Program**: $99/year
2. **Get certificates**: Download from Apple Developer
3. **Set environment variables**:
   ```bash
   export APPLE_ID=your@email.com
   export APPLE_ID_PASSWORD=app-specific-password
   ```
4. **Build & Notarize**:
   ```bash
   yarn build:mac
   ```

---

## 🔄 Publishing to GitHub Releases

### Setup

1. **Create GitHub Token**:
   - Go to: Settings → Developer → Personal Access Tokens
   - Generate token with `repo` scope

2. **Set token**:
   ```bash
   # Windows
   setx GH_TOKEN "your_token_here"
   
   # Mac/Linux
   export GH_TOKEN="your_token_here"
   ```

3. **Update package.json**:
   ```json
   "publish": [{
     "provider": "github",
     "owner": "YOUR_USERNAME",
     "repo": "Tally-Clone"
   }]
   ```

### Publish New Version

```bash
# 1. Update version
# Edit desktop/package.json: "version": "1.1.0"

# 2. Commit changes
git add .
git commit -m "Release v1.1.0"
git push

# 3. Create tag
git tag v1.1.0
git push --tags

# 4. Build and publish
cd desktop
yarn publish:all

# This will:
# - Build installers
# - Create GitHub release (draft)
# - Upload .exe and .dmg
```

### Manual Release Creation

1. Build installers: `yarn build:all`
2. Go to: GitHub → Releases → "Create new release"
3. Upload files from `desktop/dist/`
4. Publish

---

## 🤖 GitHub Actions (Automated Builds)

### Workflow File: `.github/workflows/build.yml`

```yaml
name: Build Desktop App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Build Frontend
        run: |
          cd frontend
          yarn install
          yarn build
          cp -r build ../desktop/frontend-build
      
      - name: Build Desktop
        run: |
          cd desktop
          yarn install
          yarn build
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: installers-${{ matrix.os }}
          path: desktop/dist/*
```

### Usage

```bash
# Push tag to trigger workflow
git tag v1.0.0
git push --tags

# GitHub Actions will:
# 1. Build on Windows & Mac
# 2. Create release draft
# 3. Upload installers
```

---

## 🐛 Troubleshooting

### Build Errors

**Error: Cannot find module**
```bash
cd desktop
rm -rf node_modules
yarn install
```

**Error: electron-builder not found**
```bash
yarn add electron-builder --dev
```

**Windows: Build tools missing**
```cmd
npm install --global windows-build-tools
```

### Runtime Errors

**App won't start**
- Check if port 8765 is available
- Check logs: `%APPDATA%/tally-clone/logs/`

**White screen**
- Frontend build missing: Copy `frontend/build` to `desktop/frontend-build`

**Backend not working**
- Check data directory exists: `desktop/data/`
- Check routes are properly required in `web_server.js`

---

## 📊 Build Size Optimization

### Reduce Installer Size

1. **Exclude dev dependencies**:
   ```json
   "files": [
     "!node_modules/*/{CHANGELOG.md,README.md,readme.md}",
     "!node_modules/.bin"
   ]
   ```

2. **Use asar**:
   ```json
   "asar": true
   ```

3. **Compress**:
   ```json
   "compression": "maximum"
   ```

### Typical Sizes

- **Windows**: ~120-150 MB
- **Mac**: ~140-170 MB

---

## ✅ Pre-Release Checklist

- [ ] Update version in `desktop/package.json`
- [ ] Test app in development mode
- [ ] Build installer for your platform
- [ ] Test installer (fresh install)
- [ ] Create CHANGELOG.md entry
- [ ] Tag version in Git
- [ ] Build and publish
- [ ] Write release notes
- [ ] Publish GitHub release
- [ ] Announce to users

---

## 🎯 Production Deployment

### Best Practices

1. **Version Naming**: Use semantic versioning (v1.2.3)
2. **Changelog**: Document all changes
3. **Testing**: Test on clean machines
4. **Backups**: Keep old versions available
5. **Support**: Prepare for user questions

### Release Schedule

- **Major versions** (v2.0.0): Breaking changes
- **Minor versions** (v1.1.0): New features
- **Patch versions** (v1.0.1): Bug fixes

---

**Happy Building! 🚀**
