import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { BurnTokensDto } from '@gala-chain/api';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getBalance')
  async getBalance(@Query('walletAddress') walletAddress: string, @Query('isMainnet') isMainnet: boolean): Promise<number> {
    return this.appService.getBalance(walletAddress, isMainnet);
  }

  @Post('burnMainnetGala')
  async burnMainnetGala(@Body() signedDto: any): Promise<boolean> {
    return this.appService.burnMainnetGala(signedDto);
  }
}
