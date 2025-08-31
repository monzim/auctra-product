import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenderModule } from './modules/tender/tender.module';
import { BidModule } from './modules/bid/bid.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TenderModule,
    BidModule,
    BlockchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}