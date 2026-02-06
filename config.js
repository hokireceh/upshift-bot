import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN,
    ownerId: process.env.OWNER_ID || '',
  },
  upshift: {
    apiUrl: process.env.UPSHIFT_API_URL || 'https://app.upshift.finance/api/proxy',
    walletAddresses: (process.env.WALLET_ADDRESSES || '').split(',').filter(a => a.trim()),
  },
  schedule: {
    autoClaimTime: process.env.AUTO_CLAIM_SCHEDULE || '0 9 * * *', // Default: 9 AM daily
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
  }
};
