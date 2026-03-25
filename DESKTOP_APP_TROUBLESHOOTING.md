# 🔧 Desktop App Not Opening - Troubleshooting Guide

## समस्या: Desktop App Install होने के बाद Open नहीं हो रहा

---

## Windows (.exe) Troubleshooting

### Issue 1: Windows SmartScreen Warning
**लक्षण**: "Windows protected your PC" message

**Solution**:
1. Click "More info"
2. Click "Run anyway"

**क्यों होता है**: App unsigned है (code signing certificate नहीं है)

**Permanent Fix** (For distribution):
- Code signing certificate खरीदें ($200-400/year)
- DigiCert, Sectigo, or Comodo से

### Issue 2: Antivirus Blocking
**लक्षण**: App install तो होता है लेकिन open नहीं होता

**Solution**:
```cmd
1. Windows Security खोलें
2. Virus & threat protection → Manage settings
3. Add exclusion → Folder
4. Select: C:\Users\YourName\AppData\Local\Programs\tally-accounting
```

**या Antivirus temporarily disable करें**

### Issue 3: .NET Framework Missing
**लक्षण**: App crash हो जाता है या error message

**Solution**:
```
Download और install करें:
https://dotnet.microsoft.com/download/dotnet-framework
```

### Issue 4: Port Already in Use
**लक्षण**: App open होता है लेकिन blank screen

**Check**:
```cmd
netstat -ano | findstr :8765
```

**Solution**:
```cmd
# Kill process using port 8765
taskkill /PID <process_id> /F

# Restart app
```

### Issue 5: Data Directory Permission
**लक्षण**: App crashes on startup

**Solution**:
```cmd
# Give full permissions to data folder
icacls "%APPDATA%\tally-accounting" /grant Users:F /T
```

### Issue 6: Check Logs
**Location**: `%APPDATA%\tally-accounting\logs\`

```cmd
# Open logs folder
explorer %APPDATA%\tally-accounting\logs
```

---

## Mac (.dmg) Troubleshooting

### Issue 1: "App is damaged" Error
**लक्षण**: "Tally Accounting Software is damaged and can't be opened"

**Solution**:
```bash
# Remove quarantine attribute
xattr -cr "/Applications/Tally Accounting Software.app"
```

### Issue 2: Gatekeeper Warning
**लक्षण**: "App can't be opened because it is from an unidentified developer"

**Solution**:
1. System Preferences → Security & Privacy
2. General tab → Click "Open Anyway"

**या Terminal से**:
```bash
xattr -d com.apple.quarantine "/Applications/Tally Accounting Software.app"
```

### Issue 3: Permission Issues
```bash
# Give execution permissions
chmod +x "/Applications/Tally Accounting Software.app/Contents/MacOS/"*
```

### Issue 4: Check if app is running
```bash
# Check process
ps aux | grep tally

# Check logs
tail -f ~/Library/Application\ Support/tally-accounting/logs/main.log
```

---

## Common Issues (Both Platforms)

### Issue 1: Backend Server Not Starting

**Check**:
- Port 8765 available है?
- Node.js installed है?

**Windows**:
```cmd
node --version
netstat -ano | findstr :8765
```

**Mac**:
```bash
node --version
lsof -i :8765
```

### Issue 2: Missing Dependencies

**Check node_modules**:
```bash
# In app installation folder
ls node_modules/
```

**If missing, reinstall**:
```bash
cd "C:\Users\YourName\AppData\Local\Programs\tally-accounting\resources\app"
npm install
```

### Issue 3: Data Directory Not Created

**Windows**: `%APPDATA%\tally-accounting\data\`
**Mac**: `~/Library/Application Support/tally-accounting/data/`

**Create manually**:
```bash
# Windows
mkdir %APPDATA%\tally-accounting\data

# Mac
mkdir -p ~/Library/Application\ Support/tally-accounting/data
```

---

## Development/Testing Mode

अगर desktop app build test करना है locally:

### Test without building installer

```bash
cd /app/desktop

# Install dependencies
yarn install

# Copy frontend build
mkdir -p frontend-build
cp -r ../frontend/build/* frontend-build/

# Run in dev mode
yarn start
```

**Yeh खोलेगा**:
- Electron window with app
- DevTools for debugging
- Console logs visible

### Build installer locally

**Windows**:
```bash
cd /app/desktop
yarn build:win

# Output: desktop/dist/*.exe
```

**Mac**:
```bash
cd /app/desktop
yarn build:mac

# Output: desktop/dist/*.dmg
```

---

## Quick Diagnostics

### 1. Check if installed correctly

**Windows**:
```cmd
dir "C:\Users\%USERNAME%\AppData\Local\Programs\tally-accounting"
```

**Mac**:
```bash
ls -la "/Applications/Tally Accounting Software.app"
```

### 2. Try running from command line

**Windows**:
```cmd
cd "C:\Users\%USERNAME%\AppData\Local\Programs\tally-accounting"
"Tally Accounting Software.exe"
```

**Mac**:
```bash
open "/Applications/Tally Accounting Software.app"
```

### 3. Check if backend server starts

**Look for**: `Server running on http://localhost:8765`

---

## If Still Not Working

### Option 1: Use Web Version (Recommended)

```bash
# Start backend server
cd /app/desktop
node web_server.js

# Open browser
http://localhost:8765
```

**Benefits**:
- No installation needed
- Same features
- Easier to debug
- Cross-platform

### Option 2: Rebuild Desktop App

```bash
# Clean build
cd /app/desktop
rm -rf dist/ node_modules/
yarn install

# Rebuild frontend
cd ../frontend
rm -rf build/ node_modules/
yarn install
yarn build
cp -r build/* ../desktop/frontend-build/

# Build desktop
cd ../desktop
yarn build:win  # या build:mac
```

### Option 3: Debug Mode

```bash
cd /app/desktop

# Set debug environment
export DEBUG=*  # Mac/Linux
set DEBUG=*     # Windows

# Run with detailed logs
yarn start
```

---

## Error Messages & Solutions

### "Cannot find module 'electron'"
```bash
cd /app/desktop
yarn add electron
```

### "EADDRINUSE: Port 8765 already in use"
```bash
# Kill process
lsof -i :8765 | grep LISTEN | awk '{print $2}' | xargs kill -9  # Mac
netstat -ano | findstr :8765 && taskkill /PID <PID> /F  # Windows
```

### "Error: ENOENT: no such file or directory"
```bash
# Ensure all directories exist
mkdir -p /app/desktop/data
mkdir -p /app/desktop/frontend-build
```

---

## Support Checklist

अगर issue solve नहीं हो रहा, यह information collect करें:

- [ ] Operating System (Windows 10/11, macOS version)
- [ ] App version (v1.0.x)
- [ ] Installation method (installer/manual)
- [ ] Error message (exact text or screenshot)
- [ ] Log files (from %APPDATA%\tally-accounting\logs\)
- [ ] Console output (if running from terminal)
- [ ] Antivirus software (name & version)
- [ ] Port 8765 status (in use or free)
- [ ] Node.js version (`node --version`)

---

## Current Status

**Web Version**: ✅ Working at `http://localhost:8765`  
**Desktop App**: ⚠️ Needs testing based on build output

**Recommended**: Use web version for now (same features, no installation issues)

---

## Quick Start (Web Version)

```bash
# Start backend (already running)
cd /app/desktop
node web_server.js &

# Open browser
google-chrome http://localhost:8765  # Linux
open http://localhost:8765            # Mac
start http://localhost:8765           # Windows
```

**या directly browser में type करें**: `http://localhost:8765`

Now आप company create कर सकते हैं! 🎉
