import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AppRequest } from 'src/types';
import { AccountService } from './Account.service';
import { SmsInboundDto } from './dtos/SmsInbound.dto';
import { SmsOutboundDto } from './dtos/SmsOutbound.dto';

@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/accounts')
  getAccounts() {
    return this.accountService.find();
  }

  @Get('/phonenumbers')
  getPhoneNumbers() {
    return this.accountService.getPhoneNumbers();
  }

  @Throttle(50, 60 * 60)
  @Post('/inbound/sms')
  smsInbound(@Req() req: AppRequest, @Body() smsInBoundDto: SmsInboundDto) {
    return this.accountService.smsInbound(req.user.id, smsInBoundDto);
  }

  @Post('/outbound/sms')
  smsOutbound(@Req() req: AppRequest, @Body() smsOutBoundDto: SmsOutboundDto) {
    return this.accountService.smsOutbound(req.user.id, smsOutBoundDto);
  }
}
