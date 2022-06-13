import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './Account.entity';
import { SmsInboundDto } from './dtos/SmsInbound.dto';
import { PhoneNumber } from './PhoneNumber.entity';
import { Cache } from 'cache-manager';
import { SmsOutboundDto } from './dtos/SmsOutbound.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(PhoneNumber)
    private phoneNumberRepository: Repository<PhoneNumber>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async findAccount(username: string, auth_id: string) {
    return this.accountRepository.findOne({
      where: {
        username,
        auth_id,
      },
    });
  }

  public async find() {
    return this.accountRepository.find({});
  }

  public async getPhoneNumbers() {
    return this.phoneNumberRepository.find({
      relations: {
        account: true,
      },
    });
  }

  public async smsInbound(accountId: number, { from, text }: SmsInboundDto) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: {
        account: {
          id: accountId,
        },
      },
    });

    if (!phoneNumber) {
      throw new BadRequestException({
        message: '',
        error: 'to parameter not found',
      });
    }
    if (text?.trim().toUpperCase() === 'STOP') {
      await this.cacheManager.set(from, phoneNumber.number, {
        ttl: 60 * 60 * 4,
      });
    }
    return { message: 'inbound sms ok', error: '' };
  }

  public async smsOutbound(accountId: number, { to, text }: SmsOutboundDto) {
    const phoneNumber = await this.phoneNumberRepository.findOne({
      where: {
        account: {
          id: accountId,
        },
      },
    });

    if (!phoneNumber) {
      throw new BadRequestException({
        message: '',
        error: 'from parameter not found',
      });
    }
    const sms = await this.cacheManager.get(phoneNumber.number);
    if (sms) {
      throw new BadRequestException({
        message: '',
        error: `sms from ${phoneNumber.number} to ${to} blocked by STOP request`,
      });
    }

    const counter = await this.cacheManager.get<number>(
      `/outbound/sms/${phoneNumber.number}`,
    );
    const ttl = 60 * 60 * 24;
    if (counter && counter >= 50) {
      throw new BadRequestException({
        message: '',
        error: `limit reached for from ${phoneNumber.number}`,
      });
    } else if (!counter) {
      await this.cacheManager.set(`/outbound/sms/${phoneNumber.number}`, 1, {
        ttl,
      });
    } else {
      await this.cacheManager.set(
        `/outbound/sms/${phoneNumber.number}`,
        counter + 1,
        {
          ttl,
        },
      );
    }
    return { message: 'outbound sms ok', error: '' };
  }
}
