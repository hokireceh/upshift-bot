# 📱 Upshift Telegram Bot - Panduan Lengkap

Bot Telegram untuk **auto claim harian** rewards Upshift Finance dengan **menu-based UI** (bukan command).

---

## 📦 Apa yang Anda Dapatkan

Bot ini sudah siap digunakan dengan fitur:

✅ **Menu-Based Interface** - Gunakan button bukan command  
✅ **Auto Claim Harian** - Claim otomatis sesuai jadwal (default: 9 AM)  
✅ **Multiple Wallets** - Support multiple wallet address  
✅ **Status Check** - Lihat streak dan progress  
✅ **Total Points** - Lihat total poin dan rank  
✅ **Settings Manager** - Manage wallet dari bot  
✅ **Error Handling** - Notifikasi jika ada masalah  
✅ **Production Ready** - Sudah tested dan optimized  

---

## 🎯 File Structure

```
upshift-bot/
├── index.js                    # Main file - jalankan ini
├── config.js                   # Konfigurasi
├── .env                        # Environment variables (JANGAN DI-SHARE)
├── .env.example               # Template .env
├── package.json               # Dependencies
├── Dockerfile                 # Untuk Docker
├── docker-compose.yml         # Untuk docker-compose
├── setup.sh                   # Setup otomatis
│
├── services/
│   └── upshiftService.js      # API integration dengan Upshift
│
├── handlers/
│   ├── callbacks.js           # Handler untuk setiap button
│   └── menu.js                # Menu UI dan messages
│
├── scheduler/
│   └── autoClaim.js           # Scheduler untuk auto claim
│
├── README.md                  # Full documentation
├── QUICKSTART.md              # Quick start guide
└── logs/                      # Log files (otomatis dibuat)
```

---

## 🚀 Cara Setup

### Langkah 1: Extract File

```bash
# Extract dari tar.gz
tar -xzf upshift-bot.tar.gz
cd upshift-bot

# Atau jika copy folder langsung
cd upshift-bot
```

### Langkah 2: Setup dengan Script (Recommended)

```bash
# Jalankan setup script
bash setup.sh
```

Script akan bertanya:
- Telegram Bot Token (dari @BotFather)
- Wallet Address (0x...)
- Telegram ID (dari @userinfobot)
- Auto Claim Time (optional)

Otomatis akan:
- Buat file `.env`
- Install npm packages
- Validasi konfigurasi

### Langkah 3: Manual Setup (Jika Script Error)

Buat file `.env`:

```env
# Dari @BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklmnoPQRstuvWXYZ

# URL API Upshift
UPSHIFT_API_URL=https://app.upshift.finance/api/proxy

# Wallet address (bisa multiple, pisah dengan koma)
WALLET_ADDRESSES=0x48ED913f48b853e91FDA55cEf5c63c35CA602491

# Auto claim schedule (format cron)
# 0 9 * * * = Jam 9 AM setiap hari
AUTO_CLAIM_SCHEDULE=0 9 * * *

# Telegram ID Anda
OWNER_ID=987654321

# Log level
LOG_LEVEL=info
```

Kemudian install:

```bash
npm install
```

### Langkah 4: Test Bot

```bash
# Start bot
npm start
```

Anda harus melihat:
```
✅ Bot is running and listening for messages...
```

Buka Telegram:
1. Cari bot by username
2. Kirim `/start`
3. Seharusnya muncul menu dengan button-button

---

## 🎮 Menu Bot

Setelah `/start`, Anda akan melihat menu dengan button:

```
📊 Check Status    🎯 Claim Points
💰 Total Points    ⚙️ Settings
ℹ️ Help           🔄 Refresh
```

### 📊 Check Status
Lihat status streak dan kapan bisa claim berikutnya.
```
Can Claim: ✅ Yes
Current Points: 14
Streak Days: 3 🔥
Total Points: 36
```

### 🎯 Claim Points
Manual claim rewards. Bot akan coba claim untuk semua wallet yang terdaftar.
```
✅ Claim Successful!
Points Awarded: 13
New Streak: 3 days 🔥
Total Points: 36
```

### 💰 Total Points
Lihat total poin, rank, dan detail vault.
```
Total Points: 60.86
Current Streak: 4 days 🔥
Rank: #31262
```

### ⚙️ Settings
Manage wallet dan auto claim:
- ➕ Add Wallet
- ❌ Remove Wallet
- ⏰ Auto Claim Settings

### ℹ️ Help
Dokumentasi dan cara pakai.

### 🔄 Refresh
Kembali ke menu utama.

---

## ⏰ Auto Claim Schedule

Bot akan otomatis claim sesuai jadwal di `.env` dengan format **cron**.

### Contoh Schedule

| Waktu | Format | Keterangan |
|-------|--------|-----------|
| 9:00 AM | `0 9 * * *` | Setiap hari jam 9 pagi |
| 12:00 PM | `0 12 * * *` | Setiap hari jam 12 siang |
| 3:00 PM | `0 15 * * *` | Setiap hari jam 3 sore |
| 6:00 PM | `0 18 * * *` | Setiap hari jam 6 malam |
| Setiap 6 jam | `0 */6 * * *` | 4x sehari (jam 12, 6, 12, 6) |
| Setiap 12 jam | `0 */12 * * *` | 2x sehari (jam 12 siang & malam) |

Format: `minute hour day month day-of-week`

**Timezone**: Asia/Jakarta (bisa diubah di file `scheduler/autoClaim.js`)

---

## 🏠 Menjalankan di Home Server

### Option A: Pakai PM2 (Recommended)

PM2 membuat bot jalan terus bahkan setelah reboot.

```bash
# Install PM2
npm install -g pm2

# Start bot dengan PM2
pm2 start index.js --name upshift-bot

# Auto start saat reboot
pm2 startup
pm2 save

# Check status
pm2 status

# View logs real-time
pm2 logs upshift-bot

# Restart bot
pm2 restart upshift-bot

# Stop bot
pm2 stop upshift-bot

# Delete dari PM2
pm2 delete upshift-bot
```

### Option B: Pakai Docker Compose

Lebih clean dan isolated.

```bash
# Start bot di background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```

File `docker-compose.yml` sudah disediakan dan siap pakai.

### Option C: Pakai Systemd Service (Linux)

Untuk Raspberry Pi atau Linux server.

Buat file `/etc/systemd/system/upshift-bot.service`:

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
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Kemudian:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto start
sudo systemctl enable upshift-bot

# Start service
sudo systemctl start upshift-bot

# Check status
sudo systemctl status upshift-bot

# View logs
journalctl -u upshift-bot -f
```

---

## 🔍 Troubleshooting

### Bot tidak merespons

**Penyebab:**
- Token salah
- Bot belum di-start di Telegram
- Network error
- Bot crashed

**Solusi:**
1. Cek token di `.env` benar
2. Kirim `/start` lagi di Telegram
3. Cek internet connection
4. Lihat console logs: `npm start`
5. Restart bot: `npm start`

### Auto claim tidak jalan

**Penyebab:**
- Schedule salah format
- Timezone tidak sesuai
- Bot crash saat claim

**Solusi:**
1. Cek format cron di `.env`
2. Cek timezone di `scheduler/autoClaim.js`
3. Lihat logs pada waktu schedule
4. Test manual claim dulu

### "Invalid wallet address"

**Penyebab:**
- Format wallet salah
- Typo di wallet address

**Solusi:**
1. Wallet harus format: `0x` + 40 hex characters
2. Copy exact dari MetaMask/exchange
3. Gunakan button "Add Wallet" di Settings menu

### "Already claimed today"

**Ini normal!** Upshift Finance hanya bisa claim 1x per hari. Tunggu 24 jam untuk claim berikutnya.

---

## 📊 Monitoring

### Check logs real-time

```bash
# Dengan PM2
pm2 logs upshift-bot

# Dengan Docker
docker-compose logs -f upshift-bot

# Dengan Systemd
journalctl -u upshift-bot -f
```

### Sample logs

```
✅ Bot is running and listening for messages...
🤖 [2026-02-05T10:00:00.000Z] Running auto claim...
📍 Processing wallet: 0x48ED...C602
✅ Auto claim successful for 0x48ED913f48b853e91FDA55cEf5c63c35CA602491
   Points: 13, Streak: 3 days
```

---

## 🔒 Security

1. **Jangan share `.env` file!**
   - Berisi token bot dan wallet address
   - Gunakan `.gitignore` jika di git

2. **Jangan hardcode secrets**
   - Selalu gunakan environment variables
   - Update token jika dicurigai

3. **Validasi input**
   - Bot sudah validate wallet format
   - Tapi tetap hati-hati dengan input user

4. **Backup .env**
   - Jika bot restart, pastikan .env masih ada
   - Simpan backup di tempat aman

---

## 📝 Environment Variables

`.env` file berisi:

| Variable | Purpose | Example |
|----------|---------|---------|
| `TELEGRAM_BOT_TOKEN` | Token dari BotFather | `123456:ABC...` |
| `WALLET_ADDRESSES` | Wallet untuk claim | `0x48ED...` |
| `UPSHIFT_API_URL` | API endpoint | `https://app.upshift.finance/api/proxy` |
| `AUTO_CLAIM_SCHEDULE` | Jadwal claim (cron) | `0 9 * * *` |
| `OWNER_ID` | Telegram ID pemilik | `987654321` |
| `LOG_LEVEL` | Level logging | `info` |

---

## 🆘 Support & Resources

- **Bot error?** Cek console logs
- **Upshift tidak claim?** Cek network
- **Ingin ubah schedule?** Edit `AUTO_CLAIM_SCHEDULE` di `.env`
- **Mau tambah fitur?** Edit file di `handlers/` atau `services/`

---

## 📚 File yang Penting

**Jangan edit tanpa tahu:**
- `index.js` - Main bot logic
- `services/upshiftService.js` - API calls
- `scheduler/autoClaim.js` - Auto claim logic

**Boleh di-customize:**
- `handlers/menu.js` - Messages dan menu UI
- `config.js` - Configuration
- `.env` - Environment settings

---

## 🎉 Selamat!

Bot Anda sudah siap auto claim rewards Upshift Finance setiap hari! 

### Checklist:

- [ ] Extract file
- [ ] Jalankan setup.sh atau setup manual
- [ ] Cek `.env` sudah benar
- [ ] npm install selesai
- [ ] npm start berjalan
- [ ] Bot merespons di Telegram
- [ ] Test claim points
- [ ] Setup PM2 / Docker untuk always-on
- [ ] Auto claim berjalan di waktu yang ditentukan

---

**Happy claiming! 🚀**

*Last Updated: February 5, 2026*
