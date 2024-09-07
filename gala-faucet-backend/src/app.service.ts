import { Injectable } from '@nestjs/common';
import { ChainClient } from '@gala-chain/client';
import { GalaChainResponse } from '@gala-chain/api';

@Injectable()
export class AppService {
  private readonly chainClient: ChainClient;

  constructor() {
    // Initialize ChainClient with appropriate configuration
    this.chainClient = new ChainClient({
      // Add configuration details here
    });
  }

  async getBalance(): Promise<number> {
    try {
      const response: GalaChainResponse = await this.chainClient.getBalance({
        // Add necessary parameters
      });
      return response.result as number;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  async burnMainnetGala(amount: number): Promise<boolean> {
    try {
      const response: GalaChainResponse = await this.chainClient.mintToken({
        // Add necessary parameters for burning mainnet GALA and minting testnet GALA
      });
      return response.result as boolean;
    } catch (error) {
      console.error('Error burning mainnet GALA:', error);
      throw error;
    }
  }
}
