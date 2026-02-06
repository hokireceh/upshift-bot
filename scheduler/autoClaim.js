import cron from 'node-cron';
import upshiftService from '../services/upshiftService.js';
import { config } from '../config.js';
import { autoClaimEnabled, userWallets } from '../handlers/callbacks.js';

class AutoClaimScheduler {
  constructor(bot) {
    this.bot = bot;
    this.task = null;
  }

  start() {
    if (this.task) {
      console.log('⏰ Auto claim scheduler already running');
      return;
    }

    // Parse schedule from config
    const schedule = config.schedule.autoClaimTime || '0 9 * * *';

    this.task = cron.schedule(schedule, async () => {
      console.log(`🤖 [${new Date().toISOString()}] Running auto claim...`);
      await this.runAutoClaim();
    }, {
      timezone: 'Asia/Jakarta' // Change timezone as needed
    });

    console.log(`✅ Auto claim scheduler started with schedule: ${schedule}`);
  }

  async runAutoClaim() {
    try {
      // Get wallets from config as default, or use user wallets
      const wallets = config.upshift.walletAddresses;

      if (!wallets || wallets.length === 0) {
        console.log('⚠️ No wallets configured for auto claim');
        return;
      }

      for (const wallet of wallets) {
        try {
          console.log(`📍 Processing wallet: ${upshiftService.formatAddress(wallet)}`);

          const result = await upshiftService.claimPoints(wallet);

          if (result.success) {
            console.log(`✅ Auto claim successful for ${wallet}`);
            console.log(`   Points: ${result.pointsAwarded}, Streak: ${result.streakDays} days`);

            // Notify users if they're subscribed
            await this.notifyUsers(wallet, result);
          } else {
            console.log(`⚠️ Auto claim failed for ${wallet}: ${result.message}`);
          }
        } catch (error) {
          console.error(`❌ Error processing wallet ${wallet}:`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Auto claim error:', error);
    }
  }

  async notifyUsers(wallet, result) {
    try {
      // This would notify users who have auto claim enabled
      // For now, it's a placeholder for future implementation with database
      for (const [userId, enabled] of autoClaimEnabled.entries()) {
        if (enabled) {
          try {
            const message = `🎉 Auto Claim Executed!

Wallet: ${upshiftService.formatAddress(wallet)}
Points Awarded: ${result.pointsAwarded}
Streak: ${result.streakDays} days 🔥
Total Points: ${result.totalPoints}

${result.message}`;

            await this.bot.telegram.sendMessage(userId, message);
          } catch (error) {
            console.error(`Failed to notify user ${userId}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error notifying users:', error);
    }
  }

  stop() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('⏹️ Auto claim scheduler stopped');
    }
  }
}

export default AutoClaimScheduler;
