import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BurnTokensDto } from '@gala-chain/api';

@Injectable()
export class AppService {
  private readonly apiBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiBaseUrl = this.configService.get<string>('API_BASE_URL');
  }

  async getBalance(walletAddress: string): Promise<number> {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/galachain/api/asset/token-contract/FetchBalances`, {
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
      const strippedDto = {
        prefix: signedDto.prefix,
        signature: signedDto.signature,
        uniqueKey: signedDto.uniqueKey,
        tokenInstances: signedDto.tokenInstances,
        owner: signedDto.owner
      }
      const response = await axios.post(`${this.apiBaseUrl}/galachain/api/asset/token-contract/BurnTokens`, 
        strippedDto, {
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
