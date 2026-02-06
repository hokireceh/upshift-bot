import axios from 'axios';
import { config } from '../config.js';

class UpshiftService {
  constructor() {
    this.apiUrl = config.upshift.apiUrl;
    this.client = axios.create({
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.7',
        'content-type': 'application/json',
        'cookie': 'modal_closed_welcome-modal-v1=true; restricted=false; banner_closed_upshift-points-program=true; banner_closed_pendle-usdc-rollover=true',
        'origin': 'https://app.upshift.finance',
        'referer': 'https://app.upshift.finance/portfolio',
        'sec-ch-ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Brave";v="144"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36'
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
