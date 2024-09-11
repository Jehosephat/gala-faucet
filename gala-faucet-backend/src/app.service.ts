import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BurnTokensDto } from '@gala-chain/api';
import { serialize } from "@gala-chain/api";

@Injectable()
export class AppService {
  private readonly galaswapApiBaseUrl: string;
  private readonly chainApiBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.galaswapApiBaseUrl = this.configService.get<string>('GALASWAP_API_BASE_URL');
    this.chainApiBaseUrl = this.configService.get<string>('CHAIN_API_BASE_URL');
  }

  async getBalance(walletAddress: string): Promise<number> {
    try {
      const response = await axios.post(`${this.galaswapApiBaseUrl}/galachain/api/asset/token-contract/FetchBalances`, {
        owner: walletAddress
      });

      const galaBalance = response.data.Data.find(
        (token) => token.collection === 'GALA' && token.category === 'Unit'
      );

      return galaBalance ? parseFloat(galaBalance.quantity) : 0;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  async burnMainnetGala(signedDto: any): Promise<boolean> {
    try {
      const response = await axios.post(`${this.chainApiBaseUrl}/api/asset/token-contract/BurnTokens`, 
        signedDto, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error burning mainnet GALA:', error);
      throw error;
    }
  }
}
