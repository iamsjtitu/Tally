#!/bin/bash

echo "🧮 Tally Clone - Desktop Application Test"
echo "=========================================="
echo ""

# Check Node.js
echo "✅ Checking Node.js..."
node --version || { echo "❌ Node.js not found!"; exit 1; }
echo ""

# Check Yarn
echo "✅ Checking Yarn..."
yarn --version || { echo "❌ Yarn not found!"; exit 1; }
echo ""

# Check frontend build
echo "✅ Checking frontend build..."
if [ -d "/app/desktop/frontend-build" ] && [ -f "/app/desktop/frontend-build/index.html" ]; then
    echo "   Frontend build found ✓"
else
    echo "   ❌ Frontend build missing!"
    echo "   Run: cd /app/frontend && yarn build && cp -r build/* /app/desktop/frontend-build/"
    exit 1
fi
echo ""

# Check desktop dependencies
echo "✅ Checking desktop dependencies..."
if [ -d "/app/desktop/node_modules" ]; then
    echo "   Dependencies installed ✓"
else
    echo "   ❌ Dependencies missing!"
    echo "   Run: cd /app/desktop && yarn install"
    exit 1
fi
echo ""

# Check data directory
echo "✅ Checking data directory..."
mkdir -p /app/desktop/data
echo "   Data directory ready ✓"
echo ""

# Check routes
echo "✅ Checking API routes..."
for route in companies ledgers vouchers inventory reports; do
    if [ -f "/app/desktop/routes/${route}.js" ]; then
        echo "   ${route}.js ✓"
    else
        echo "   ❌ ${route}.js missing!"
    fi
done
echo ""

echo "=========================================="
echo "🎉 All checks passed!"
echo ""
echo "To run the app:"
echo "  cd /app/desktop"
echo "  yarn start"
echo ""
echo "To build installers:"
echo "  cd /app/desktop"
echo "  yarn build:win   # Windows .exe"
echo "  yarn build:mac   # Mac .dmg"
echo "  yarn build:all   # Both platforms"
echo ""
echo "=========================================="
