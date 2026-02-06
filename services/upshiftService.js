import axios from 'axios';
import { config } from './config.js';

class UpshiftService {
  constructor() {
    this.apiUrl = config.upshift.apiUrl;
    this.client = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
  }

  async claimPoints(address) {
    try {
      const response = await this.client.post(`${this.apiUrl}/streak/claim`, {
        address: address
      });

      if (response.status === 200 && response.data.data.success) {
        return {
          success: true,
          pointsAwarded: response.data.data.pointsAwarded,
          streakDays: response.data.data.newStreakDays,
          totalPoints: response.data.data.totalPoints,
          message: response.data.data.message
        };
      }
      return {
        success: false,
        message: 'Failed to claim points'
      };
    } catch (error) {
      // Check if error is "already claimed"
      if (error.response?.status === 429 || error.response?.data?.message?.includes('already claimed')) {
        return {
          success: false,
          message: 'Already claimed today. Try again tomorrow.',
          alreadyClaimed: true
        };
      }
      console.error('Claim error:', error.message);
      return {
        success: false,
        message: `Error: ${error.message}`,
        alreadyClaimed: false
      };
    }
  }

  async getStreakStatus(address) {
    try {
      const response = await this.client.get(`${this.apiUrl}/streak/status?address=${address}`);
      
      if (response.status === 200) {
        return {
          success: true,
          canClaim: response.data.data.canClaim,
          currentPoints: response.data.data.currentPoints,
          streakDays: response.data.data.streakDays,
          totalPoints: response.data.data.totalPoints,
          timeUntilReset: response.data.data.timeUntilReset,
          lastClaimedAt: response.data.data.lastClaimedAt,
          hasActivePositions: response.data.data.hasActivePositions
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Status error:', error.message);
      return { success: false };
    }
  }

  async getTotalPoints(address) {
    try {
      const response = await this.client.get(`${this.apiUrl}/points/total?wallet=${address}&chainId=`);
      
      if (response.status === 200) {
        const data = response.data.data;
        return {
          success: true,
          totalPoints: data.totalPoints,
          referralEarnings: data.referralEarnings,
          streakDays: data.streak,
          rank: data.rank,
          topVault: data.topVault,
          pools: data.pools
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Total points error:', error.message);
      return { success: false };
    }
  }

  formatAddress(address) {
    if (!address) return 'Unknown';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
}

export default new UpshiftService();
