import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvTypes } from 'src/config/types';
import { BasicAuthMiddleware } from 'src/middlewares/BasicAuth';
import methodsFilter from 'src/middlewares/MethodsFilter';
import configurations from '../config/configurations';
import { AccountModule } from './Account/Account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvTypes>) => ({
        type: 'postgres',
        url: configService.get('dbUrl'),
        autoLoadEntities: true,
        synchronize: false,
        ...(configService.get('environment') === 'production'
          ? { ssl: { rejectUnauthorized: false } }
          : {}),
      }),
      inject: [ConfigService],
    }),

    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware, methodsFilter).forRoutes('*');
  }
}
