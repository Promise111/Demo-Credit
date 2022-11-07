import { HelperModule } from './utils/helper/helper.module';
import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          client: 'mysql2',
          version: '5.7',
          connection: {
            host: config.get('HOST'),
            port: config.get('PORT'),
            user: config.get('USERNAME'),
            password: config.get('PASSWORD'),
            database: config.get('DATABASE'),
          },
        },
      }),
    }),
    AuthModule,
    AccountModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
