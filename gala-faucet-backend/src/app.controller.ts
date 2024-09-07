import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getBalance')
  async getBalance(): Promise<number> {
    return this.appService.getBalance();
  }

  @Post('burnMainnetGala')
  async burnMainnetGala(@Body() body: { amount: number }): Promise<boolean> {
    return this.appService.burnMainnetGala(body.amount);
  }
}
