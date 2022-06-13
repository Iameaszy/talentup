import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from './Account.controller';
import { PhoneNumber } from './PhoneNumber.entity';
import { AccountService } from './Account.service';
import { Account } from './Account.entity';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvTypes } from 'src/config/types';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, PhoneNumber]),
    CacheModule.registerAsync<ClientOpts>({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvTypes>) => ({
        store: redisStore,
        url: configService.get('redisUrl'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
