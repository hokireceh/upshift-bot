import { Telegraf, session } from 'telegraf';
import { config } from './config.js';
import AutoClaimScheduler from './scheduler/autoClaim.js';
import {
  handleStart,
  handleMainMenu,
  handleCheckStatus,
  handleClaimPoints,
  handleTotalPoints,
  handleSettings,
  handleAddWallet,
  handleRemoveWallet,
  handleAutoClaimSettings,
  handleEnableAutoClaim,
  handleDisableAutoClaim,
  handleHelp,
  handleTextMessage
} from './handlers/callbacks.js';

// Validate config
if (!config.telegram.token) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in .env file');
  process.exit(1);
}

if (config.upshift.walletAddresses.length === 0) {
  console.warn('⚠️ No WALLET_ADDRESSES configured in .env file');
}

// Initialize bot
const bot = new Telegraf(config.telegram.token);

// Add session middleware
bot.use(session());

// ============== COMMAND HANDLERS ==============
bot.start(handleStart);
bot.command('help', handleHelp);

// ============== CALLBACK HANDLERS ==============
bot.action('main_menu', handleMainMenu);
bot.action('check_status', handleCheckStatus);
bot.action('claim_points', handleClaimPoints);
bot.action('total_points', handleTotalPoints);
bot.action('settings', handleSettings);
bot.action('add_wallet', handleAddWallet);
bot.action('remove_wallet', handleRemoveWallet);
bot.action('auto_claim_settings', handleAutoClaimSettings);
bot.action('enable_auto_claim', handleEnableAutoClaim);
bot.action('disable_auto_claim', handleDisableAutoClaim);
bot.action('help', handleHelp);

// Handle wallet removal
bot.action(/remove_wallet_\d+/, async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const idx = parseInt(ctx.match[0].split('_')[2]);
    const userId = ctx.from.id;
    
    // Implementation for removing wallet by index
    console.log(`Removing wallet at index ${idx} for user ${userId}`);
    
    // This would require database implementation
    ctx.reply('❌ Wallet removal not yet implemented in memory mode', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Settings', callback_data: 'settings' }]]
      }
    });
  } catch (error) {
    console.error('Remove wallet action error:', error);
  }
});

// ============== MESSAGE HANDLERS ==============
bot.on('text', handleTextMessage);

// ============== ERROR HANDLING ==============
bot.catch((err, ctx) => {
  console.error('❌ Bot error:', err);
  ctx.reply('⚠️ An unexpected error occurred. Please try again.').catch(e => {
    console.error('Failed to send error message:', e);
  });
});

// ============== BOT LAUNCH ==============
const launch = async () => {
  try {
    // Get bot info
    const botInfo = await bot.telegram.getMe();
    console.log(`\n🤖 Bot initialized: @${botInfo.username}`);

    // Initialize auto claim scheduler
    const scheduler = new AutoClaimScheduler(bot);
    scheduler.start();

    // Handle graceful shutdown
    process.once('SIGINT', () => {
      console.log('\n\n⏹️ Shutting down bot...');
      scheduler.stop();
      bot.stop('SIGINT');
      process.exit(0);
    });

    process.once('SIGTERM', () => {
      console.log('\n\n⏹️ Shutting down bot...');
      scheduler.stop();
      bot.stop('SIGTERM');
      process.exit(0);
    });

    // Start bot
    await bot.launch();
    console.log('✅ Bot is running and listening for messages...\n');

  } catch (error) {
    console.error('❌ Failed to launch bot:', error);
    process.exit(1);
  }
};

// Launch bot
launch().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

export default bot;
