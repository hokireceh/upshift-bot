import upshiftService from '../services/upshiftService.js';
import { getMainMenu, getSettingsMenu, getAutoClaimMenu, messages } from './menu.js';
import { config } from '../config.js';

const userWallets = new Map(); // In production, use database
const autoClaimEnabled = new Map(); // In production, use database

export const handleStart = async (ctx) => {
  try {
    await ctx.reply(messages.welcome, getMainMenu());
  } catch (error) {
    console.error('Start handler error:', error);
    await ctx.reply(messages.error(error.message));
  }
};

export const handleMainMenu = async (ctx) => {
  try {
    await ctx.editMessageText(messages.mainMenu, getMainMenu());
  } catch (error) {
    if (!error.message.includes('message is not modified')) {
      console.error('Main menu handler error:', error);
    }
  }
};

export const handleCheckStatus = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const wallets = userWallets.get(userId) || config.upshift.walletAddresses;

    if (!wallets || wallets.length === 0) {
      await ctx.reply(messages.noWallets, getMainMenu());
      return;
    }

    await ctx.reply(messages.processingRequest);

    for (const wallet of wallets) {
      const status = await upshiftService.getStreakStatus(wallet);
      
      if (status.success) {
        const shortAddress = upshiftService.formatAddress(wallet);
        await ctx.reply(messages.statusInfo(shortAddress, status), getMainMenu());
      } else {
        await ctx.reply(messages.error('Failed to fetch status'), getMainMenu());
      }
    }
  } catch (error) {
    console.error('Check status handler error:', error);
    await ctx.reply(messages.error(error.message));
  }
};

export const handleClaimPoints = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const wallets = userWallets.get(userId) || config.upshift.walletAddresses;

    if (!wallets || wallets.length === 0) {
      await ctx.reply(messages.noWallets, getMainMenu());
      return;
    }

    await ctx.reply(messages.processingRequest);

    for (const wallet of wallets) {
      const result = await upshiftService.claimPoints(wallet);
      const shortAddress = upshiftService.formatAddress(wallet);

      if (result.success) {
        await ctx.reply(messages.claimSuccess(result));
      } else {
        await ctx.reply(messages.claimFailed(result.message));
      }
    }

    await ctx.reply(messages.mainMenu, getMainMenu());
  } catch (error) {
    console.error('Claim points handler error:', error);
    await ctx.reply(messages.error(error.message));
  }
};

export const handleTotalPoints = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const wallets = userWallets.get(userId) || config.upshift.walletAddresses;

    if (!wallets || wallets.length === 0) {
      await ctx.reply(messages.noWallets, getMainMenu());
      return;
    }

    await ctx.reply(messages.processingRequest);

    for (const wallet of wallets) {
      const data = await upshiftService.getTotalPoints(wallet);
      
      if (data.success) {
        const shortAddress = upshiftService.formatAddress(wallet);
        await ctx.reply(messages.totalPointsInfo(shortAddress, data));
      } else {
        await ctx.reply(messages.error('Failed to fetch total points'));
      }
    }

    await ctx.reply(messages.mainMenu, getMainMenu());
  } catch (error) {
    console.error('Total points handler error:', error);
    await ctx.reply(messages.error(error.message));
  }
};

export const handleSettings = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.editMessageText(messages.settings, getSettingsMenu());
  } catch (error) {
    if (!error.message.includes('message is not modified')) {
      console.error('Settings handler error:', error);
    }
  }
};

export const handleAddWallet = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    ctx.session.action = 'add_wallet';
    await ctx.reply(messages.enterWalletAddress);
  } catch (error) {
    console.error('Add wallet handler error:', error);
  }
};

export const handleRemoveWallet = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const wallets = userWallets.get(userId) || [];

    if (wallets.length === 0) {
      await ctx.reply('❌ No wallets to remove');
      return;
    }

    const buttons = wallets.map((wallet, idx) => [
      {
        text: `${upshiftService.formatAddress(wallet)}`,
        callback_data: `remove_wallet_${idx}`
      }
    ]);
    buttons.push([{ text: 'Cancel', callback_data: 'settings' }]);

    await ctx.reply('Select wallet to remove:', {
      reply_markup: { inline_keyboard: buttons }
    });
  } catch (error) {
    console.error('Remove wallet handler error:', error);
  }
};

export const handleAutoClaimSettings = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    const enabled = autoClaimEnabled.get(userId) !== false; // Default enabled

    await ctx.editMessageText(
      `⏰ Auto Claim Status: ${enabled ? '✅ Enabled' : '❌ Disabled'}\n\nAuto claims run daily at 9 AM\n\nChange this setting:`,
      getAutoClaimMenu()
    );
  } catch (error) {
    if (!error.message.includes('message is not modified')) {
      console.error('Auto claim settings handler error:', error);
    }
  }
};

export const handleEnableAutoClaim = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    autoClaimEnabled.set(userId, true);
    await ctx.reply(messages.autoClaimEnabled, getMainMenu());
  } catch (error) {
    console.error('Enable auto claim handler error:', error);
  }
};

export const handleDisableAutoClaim = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    const userId = ctx.from.id;
    autoClaimEnabled.set(userId, false);
    await ctx.reply(messages.autoClaimDisabled, getMainMenu());
  } catch (error) {
    console.error('Disable auto claim handler error:', error);
  }
};

export const handleHelp = async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.reply(messages.help, {
      parse_mode: 'Markdown',
      ...getMainMenu()
    });
  } catch (error) {
    console.error('Help handler error:', error);
  }
};

export const handleTextMessage = async (ctx) => {
  try {
    if (!ctx.session) ctx.session = {};

    if (ctx.session.action === 'add_wallet') {
      const address = ctx.message.text.trim();

      // Validate wallet address
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        await ctx.reply('❌ Invalid wallet address! Please enter a valid Ethereum address (0x...)');
        return;
      }

      const userId = ctx.from.id;
      const wallets = userWallets.get(userId) || [];

      if (wallets.includes(address)) {
        await ctx.reply('❌ This wallet is already added!');
      } else {
        wallets.push(address);
        userWallets.set(userId, wallets);
        await ctx.reply(messages.walletAdded(upshiftService.formatAddress(address)), getMainMenu());
      }

      delete ctx.session.action;
    }
  } catch (error) {
    console.error('Text message handler error:', error);
    await ctx.reply(messages.error(error.message));
  }
};

export { userWallets, autoClaimEnabled };
