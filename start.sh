#!/usr/bin/env bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$PROJECT_DIR/server"
CLIENT_DIR="$PROJECT_DIR/client"

echo "=== Starting MySQL (XAMPP) ==="
sudo /opt/lampp/ctlscript.sh start mysql
echo "MySQL is running."

echo ""
echo "Opening backend terminal..."
gnome-terminal --title="Backend (Spring Boot :8080)" \
  -- bash -c "cd '$SERVER_DIR' && echo 'Starting Spring Boot...' && ./mvnw spring-boot:run; read -p 'Press Enter to close...'" &

sleep 1

echo "Opening frontend terminal..."
gnome-terminal --title="Frontend (Vite :5173)" \
  -- bash -c "cd '$CLIENT_DIR' && npm install && echo 'Starting Vite...' && npm run dev; read -p 'Press Enter to close...'" &

echo ""
echo "Backend:   http://localhost:8080"
echo "Frontend:  http://localhost:5173"
echo ""
echo "Each service runs in its own terminal window. Close a window to stop that service."
