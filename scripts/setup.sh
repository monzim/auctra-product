#!/bin/bash

echo "🚀 Setting up Auctra Blockchain Demo..."

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Create necessary directories
mkdir -p src/contracts

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. npm run chain:start    # Start Hardhat blockchain"
echo "2. npm run chain:deploy   # Deploy smart contracts" 
echo "3. npm run dev            # Start frontend"
echo "4. npm run backend:dev    # Start backend API"
echo ""
echo "Or use Docker:"
echo "docker-compose up         # Start all services"