# Upshift Finance Telegram Bot

Auto claim daily Upshift Finance rewards dengan Telegram bot menu-based.

## 🚀 Features

- ✅ **Auto Daily Claims** - Otomatis claim rewards setiap hari jam 9 pagi
- 📊 **Check Status** - Lihat streak dan status claim
- 💰 **Total Points** - Lihat total poin dan rank
- 🎯 **Manual Claim** - Claim kapan saja
- ⚙️ **Easy Settings** - Manage wallets dan auto claim
- 🔔 **Notifications** - Notifikasi untuk setiap claim
- 📱 **Menu-Based** - UI yang user-friendly tanpa command

## 📋 Requirements

- Node.js 16+
- npm atau yarn
- Telegram Bot Token (dari BotFather)
- Wallet Ethereum address (0x...)

## 🔧 Installation

### 1. Clone atau extract files

```bash
cd upshift-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup .env file

Edit file `.env` dan isi konfigurasi:

```env
# Dapatkan dari BotFather di Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Wallet address(es) untuk auto claim
# Bisa multiple, pisahkan dengan koma
WALLET_ADDRESSES=0x48ED913f48b853e91FDA55cEf5c63c35CA602491

# Cron schedule (default: 9 AM setiap hari)
# Format: "0 9 * * *" (minute hour day month day-of-week)
AUTO_CLAIM_SCHEDULE=0 9 * * *

# Your Telegram User ID (opsional, untuk admin commands)
OWNER_ID=your_telegram_id

# Log level
LOG_LEVEL=info
```

### 4. Get Telegram Bot Token

1. Open Telegram dan cari `@BotFather`
2. Ketik `/start`
3. Ketik `/newbot`
4. Ikuti instruksi untuk membuat bot baru
5. Copy token yang diberikan ke `.env` file

### 5. Get Your Telegram ID

1. Cari `@userinfobot` di Telegram
2. Ketik `/start`
3. Bot akan mengirim ID Anda

## ▶️ Running the Bot

### Development Mode (auto-restart on file changes)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## 🎮 Usage

### User Commands

Bot menggunakan menu yang user-friendly. Setelah `/start`:

| Menu | Fungsi |
|------|--------|
| 📊 Check Status | Lihat status streak dan claim |
| 🎯 Claim Points | Manual claim rewards |
| 💰 Total Points | Lihat total poin dan rank |
| ⚙️ Settings | Manage wallets & auto claim |
| ℹ️ Help | Lihat help guide |
| 🔄 Refresh | Kembali ke menu utama |

### Settings Menu

Di settings, Anda bisa:
- ➕ **Add Wallet** - Tambah wallet baru
- ❌ **Remove Wallet** - Hapus wallet
- ⏰ **Auto Claim Settings** - Enable/disable auto claim

## ⏰ Auto Claim Schedule

Bot akan otomatis claim setiap hari pada waktu yang ditentukan di `.env`:

```
AUTO_CLAIM_SCHEDULE=0 9 * * *
```

Format cron (minute hour day month day-of-week):
- `0 9 * * *` = Jam 9:00 pagi setiap hari
- `0 12 * * *` = Jam 12:00 (noon) setiap hari
- `30 14 * * *` = Jam 14:30 (2:30 PM) setiap hari
- `0 */6 * * *` = Setiap 6 jam

**Timezone**: Asia/Jakarta (bisa diubah di `scheduler/autoClaim.js`)

## 💾 Data Storage

Bot saat ini menyimpan data di memory (akan hilang saat restart). Untuk production, gunakan:
- MongoDB
- PostgreSQL
- Firebase
- Redis

Edit `handlers/callbacks.js` untuk implementasi database.

## 📁 Project Structure

```
upshift-bot/
├── index.js                 # Main bot file
├── config.js               # Configuration
├── package.json            # Dependencies
├── .env                    # Environment variables
├── services/
│   └── upshiftService.js   # Upshift API integration
├── handlers/
│   ├── callbacks.js        # Action handlers
│   └── menu.js             # Menu & messages
└── scheduler/
    └── autoClaim.js        # Auto claim scheduler
```

## 🔒 Security Tips

1. ✅ Jangan share `.env` file
2. ✅ Jangan commit `.env` ke git
3. ✅ Gunakan environment variables
4. ✅ Rotate bot token secara berkala
5. ✅ Validasi semua input user

## 🐛 Troubleshooting

### Bot tidak merespons

1. Pastikan token di `.env` benar
2. Pastikan bot sudah di-start dengan `/start`
3. Cek network connection
4. Lihat console logs untuk error

### Auto claim tidak jalan

1. Cek timezone di `scheduler/autoClaim.js`
2. Verify cron schedule di `.env`
3. Lihat logs untuk error
4. Pastikan wallet address valid

### "No wallets configured"

1. Tambah wallet di Settings menu
2. Atau update `.env` dengan `WALLET_ADDRESSES`

## 📊 Logs

Bot akan print logs untuk setiap action:

```
✅ Bot is running and listening for messages...
🤖 [2026-02-05T10:00:00.000Z] Running auto claim...
📍 Processing wallet: 0x48ED...C602
✅ Auto claim successful for 0x48ED...C602
```

## 🚀 Advanced Setup

### Running with PM2 (Production)

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start index.js --name "upshift-bot"

# Monitor
pm2 monit

# View logs
pm2 logs upshift-bot

# Restart on reboot
pm2 startup
pm2 save
```

### Running with Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
```

Build: `docker build -t upshift-bot .`
Run: `docker run --env-file .env upshift-bot`

### Environment Variables untuk Production

```env
# Dari secrets manager
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
WALLET_ADDRESSES=${WALLET_ADDRESSES}
AUTO_CLAIM_SCHEDULE=${AUTO_CLAIM_SCHEDULE}

# Database
DB_HOST=localhost
DB_USER=user
DB_PASS=password
DB_NAME=upshift_bot
```

## 📝 License

MIT

## 💬 Support

Untuk masalah atau pertanyaan, buat issue atau hubungi developer.

## 📚 Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegraf.js](https://telegraf.js.org)
- [Node-cron](https://github.com/kelektiv/node-cron)
- [Upshift Finance](https://upshift.finance)

---

**Developed with ❤️ for Upshift Finance community**
