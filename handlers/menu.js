import { Markup } from 'telegraf';

export const getMainMenu = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('📊 Check Status', 'check_status'),
      Markup.button.callback('🎯 Claim Points', 'claim_points')
    ],
    [
      Markup.button.callback('💰 Total Points', 'total_points'),
      Markup.button.callback('⚙️ Settings', 'settings')
    ],
    [
      Markup.button.callback('ℹ️ Help', 'help'),
      Markup.button.callback('🔄 Refresh', 'main_menu')
    ]
  ]);
};

export const getSettingsMenu = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('➕ Add Wallet', 'add_wallet')],
    [Markup.button.callback('❌ Remove Wallet', 'remove_wallet')],
    [Markup.button.callback('⏰ Auto Claim Settings', 'auto_claim_settings')],
    [Markup.button.callback('⬅️ Back to Menu', 'main_menu')]
  ]);
};

export const getAutoClaimMenu = () => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Enable', 'enable_auto_claim'),
      Markup.button.callback('❌ Disable', 'disable_auto_claim')
    ],
    [Markup.button.callback('⬅️ Back', 'settings')]
  ]);
};

export const getConfirmMenu = (action) => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Yes', `confirm_${action}`),
      Markup.button.callback('❌ No', 'main_menu')
    ]
  ]);
};

export const messages = {
  welcome: `👋 Welcome to Upshift Finance Bot!

This bot helps you manage your Upshift rewards and automate daily claims.

Choose an option from the menu below:`,

  mainMenu: `📱 Main Menu
Select an action to continue:`,

  settings: `⚙️ Settings
Manage your wallets and auto claim preferences:`,

  help: `❓ Help Guide

**Available Commands:**
📊 Check Status - View your current streak and claim status
🎯 Claim Points - Manually claim your daily points
💰 Total Points - Check your total points and rank
⚙️ Settings - Manage wallets and auto claim

**How it works:**
• Connect your wallet address
• Claims happen daily at 9 AM (customizable)
• You can manually claim anytime
• Maintains your streak for daily bonuses

**Tips:**
• Don't miss a day to keep your streak
• More active positions = more points
• Share referral link for bonus points

Need more help? Use /support`,

  noWallets: `❌ No wallets configured!

Please add a wallet address first using the Settings menu.`,

  claimSuccess: (data) => `✅ Claim Successful!

Points Awarded: ${data.pointsAwarded}
New Streak: ${data.streakDays} days 🔥
Total Points: ${data.totalPoints}

${data.message}`,

  claimFailed: (message) => `❌ Claim Failed

${message}`,

  statusInfo: (address, status) => `📊 Status for ${address}

Can Claim: ${status.canClaim ? '✅ Yes' : '❌ No'}
Current Points: ${status.currentPoints}
Streak Days: ${status.streakDays} 🔥
Total Points: ${status.totalPoints}
Last Claimed: ${new Date(status.lastClaimedAt).toLocaleString()}
Active Positions: ${status.hasActivePositions ? '✅ Yes' : '❌ No'}`,

  totalPointsInfo: (address, data) => `💰 Total Points for ${address}

Total Points: ${data.totalPoints.toFixed(2)}
Referral Earnings: ${data.referralEarnings}
Current Streak: ${data.streakDays} days 🔥
Rank: #${data.rank}

Top Vault:
${Object.entries(data.pools).map(([vault, pool]) => 
  `  • Deposited: $${parseFloat(pool.amountDepositedInUsd).toFixed(2)}`
).join('\n')}`,

  processingRequest: `⏳ Processing your request...`,

  enterWalletAddress: `Please enter your wallet address (0x...):`,

  walletAdded: (address) => `✅ Wallet added successfully!
Address: ${address}`,

  walletRemoved: (address) => `✅ Wallet removed successfully!
Address: ${address}`,

  autoClaimEnabled: `✅ Auto claim enabled!
You will receive daily claims at 9 AM.`,

  autoClaimDisabled: `❌ Auto claim disabled.
You can still manually claim using the "Claim Points" button.`,

  error: (message) => `⚠️ An error occurred:
${message}`
};
