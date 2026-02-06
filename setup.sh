#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Upshift Finance Telegram Bot Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Keeping existing .env file${NC}\n"
    else
        rm .env
    fi
fi

# Get inputs
echo -e "${BLUE}Please provide the following information:${NC}\n"

read -p "$(echo -e ${GREEN}Telegram Bot Token${NC} (from @BotFather): )" BOT_TOKEN
read -p "$(echo -e ${GREEN}Wallet Address${NC} (0x...): )" WALLET_ADDRESS
read -p "$(echo -e ${GREEN}Your Telegram ID${NC} (from @userinfobot): )" OWNER_ID
read -p "$(echo -e ${GREEN}Auto Claim Time${NC} (default: 0 9 * * * for 9 AM): )" CLAIM_TIME

# Set defaults
CLAIM_TIME=${CLAIM_TIME:-"0 9 * * *"}

# Create .env file
cat > .env << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=$BOT_TOKEN

# Upshift Finance API Configuration
UPSHIFT_API_URL=https://app.upshift.finance/api/proxy

# Wallet Addresses (comma separated if multiple)
WALLET_ADDRESSES=$WALLET_ADDRESS

# Cron Schedule untuk auto claim (format: "0 9 * * *" = setiap hari jam 9 pagi)
# Timezone: Asia/Jakarta
AUTO_CLAIM_SCHEDULE=$CLAIM_TIME

# Owner Telegram ID (untuk admin commands)
OWNER_ID=$OWNER_ID

# Log level
LOG_LEVEL=info
EOF

echo -e "\n${GREEN}✅ .env file created successfully!${NC}\n"

# Install dependencies
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}Installing dependencies...${NC}\n"
npm install

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Dependencies installed successfully!${NC}\n"
else
    echo -e "\n${RED}❌ Failed to install dependencies${NC}\n"
    exit 1
fi

# Summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo "1. Start the bot: npm start"
echo "2. Open Telegram and find @BotName"
echo "3. Click /start to initialize"
echo ""
echo -e "${YELLOW}📝 Your Configuration:${NC}"
echo "  Bot Token: ${BOT_TOKEN:0:20}..."
echo "  Wallet: $WALLET_ADDRESS"
echo "  Auto Claim: $CLAIM_TIME (Asia/Jakarta)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "  • Don't share your .env file"
echo "  • Don't commit .env to git"
echo "  • Keep your bot token secret"
echo ""
