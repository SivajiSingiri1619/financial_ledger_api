import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { LedgerModule } from './ledger/ledger.module';
import { TransactionsModule } from './transactions/transactions.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ledger',
      password: 'ledger123',
      database: 'ledgerdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AccountsModule,
    LedgerModule,
    TransactionsModule,
  ],
})
export class AppModule {}

