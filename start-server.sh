#!/bin/bash

echo "🚀 Starting Tally Clone Backend Server..."
echo ""

cd /app/desktop

# Kill any existing process on port 8765
lsof -ti:8765 | xargs kill -9 2>/dev/null || true

# Start backend server
node web_server.js &
SERVER_PID=$!

echo "✅ Backend server started (PID: $SERVER_PID)"
echo "📡 API running on: http://localhost:8765/api"
echo "🌐 Frontend URL: http://localhost:8765"
echo ""
echo "Test the API:"
echo "  curl http://localhost:8765/api/health"
echo ""
echo "To stop the server:"
echo "  kill $SERVER_PID"
echo ""
echo "Press Ctrl+C to stop..."

# Wait for the process
wait $SERVER_PID
