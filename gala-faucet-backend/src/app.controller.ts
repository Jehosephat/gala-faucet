import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getBalance')
  async getBalance(@Query('walletAddress') walletAddress: string): Promise<number> {
    return this.appService.getBalance(walletAddress);
  }

  @Post('burnMainnetGala')
  async burnMainnetGala(
    @Body() body: { 
      amount: string, 
      signature: string, 
      signerPublicKey: string 
    }
  ): Promise<boolean> {
    return this.appService.burnMainnetGala(
      body.amount,
      body.signature,
      body.signerPublicKey
    );
  }
}
