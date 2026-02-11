import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nestjs-knex';
import config from '../knexfile';
import { AppController } from './app.controller';
import { WeeshModule } from './weesh.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    KnexModule.forRoot({ config }),
    WeeshModule,
  ],
})
export class AppModule {}
