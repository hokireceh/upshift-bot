# 🚀 Quick Start Guide

## Step 1: Get Required Information

### Telegram Bot Token
1. Open Telegram → Search `@BotFather`
2. Click `/start`
3. Click `/newbot`
4. Follow instructions (give it a name and username)
5. Copy the **token** (like: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ`)

### Your Telegram ID
1. Open Telegram → Search `@userinfobot`
2. Click `/start`
3. Bot will reply with your ID (like: `987654321`)

### Wallet Address
- Your Ethereum wallet address (starts with `0x...`)
- Get from MetaMask, Trust Wallet, or wherever you manage your crypto

---

## Step 2: Setup Bot

### Option A: Automated Setup (Recommended)

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

Then follow the prompts to enter:
- Telegram Bot Token
- Wallet Address
- Your Telegram ID
- Auto claim time (optional, defaults to 9 AM)

### Option B: Manual Setup

1. Copy `.env` dari `.env.example` (jika ada) atau buat baru:

```bash
cp .env.example .env
```

2. Edit `.env` dengan text editor:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
WALLET_ADDRESSES=0x48ED913f48b853e91FDA55cEf5c63c35CA602491
OWNER_ID=your_telegram_id
AUTO_CLAIM_SCHEDULE=0 9 * * *
```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Start the Bot

### Development (with auto-restart)
```bash
npm run dev
```

### Production
```bash
npm start
```

You should see:
```
✅ Bot is running and listening for messages...
```

---

## Step 5: Test the Bot

1. Open Telegram
2. Search for your bot by username
3. Click `/start`
4. You should see the main menu with buttons

### Test Features:
- Click "🎯 Claim Points" → Should attempt to claim
- Click "📊 Check Status" → Should show your streak
- Click "⚙️ Settings" → Access wallet management

---

## Auto Claim Times

Edit `AUTO_CLAIM_SCHEDULE` in `.env`:

| Time | Schedule |
|------|----------|
| 9:00 AM | `0 9 * * *` |
| 12:00 PM | `0 12 * * *` |
| 3:00 PM | `0 15 * * *` |
| 6:00 PM | `0 18 * * *` |
| 9:00 PM | `0 21 * * *` |

---

## Docker Setup (Alternative)

1. Install [Docker](https://docs.docker.com/get-docker/)

2. Create `.env`:
```env
TELEGRAM_BOT_TOKEN=your_token
WALLET_ADDRESSES=0x...
OWNER_ID=your_id
```

3. Run:
```bash
docker-compose up -d
```

4. Check logs:
```bash
docker logs upshift-telegram-bot
```

---

## Troubleshooting

### Bot doesn't respond
- ✅ Verify token in `.env` is correct
- ✅ Make sure bot was sent `/start` command
- ✅ Check internet connection
- ✅ Restart bot: `npm start`

### Auto claim not working
- ✅ Check timezone in `scheduler/autoClaim.js`
- ✅ Verify `AUTO_CLAIM_SCHEDULE` format
- ✅ Check logs in console

### "Invalid wallet address"
- ✅ Wallet must start with `0x`
- ✅ Wallet must be 42 characters long
- ✅ All characters after `0x` must be hex (0-9, a-f)

### Port already in use
- ✅ Change port in `.env` or stop other services

---

## Keep Running on Home Server

### Option 1: PM2 (Node Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start index.js --name upshift-bot

# Auto restart on reboot
pm2 startup
pm2 save

# Check status
pm2 status

# View logs
pm2 logs upshift-bot
```

### Option 2: Systemd Service

Create `/etc/systemd/system/upshift-bot.service`:

```ini
[Unit]
Description=Upshift Telegram Bot
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/upshift-bot
ExecStart=/usr/bin/node /home/pi/upshift-bot/index.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable upshift-bot
sudo systemctl start upshift-bot
sudo systemctl status upshift-bot
```

### Option 3: Docker Compose

```bash
docker-compose up -d
docker-compose logs -f
```

---

## Support

Need help? Check:
- [README.md](./README.md) - Full documentation
- Console logs - Error messages
- Telegram logs - What happened

---

**Happy claiming! 🎉**
