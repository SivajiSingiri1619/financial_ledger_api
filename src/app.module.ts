import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LedgerModule } from './ledger/ledger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'ledger.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AccountsModule,
    TransactionsModule,
    LedgerModule,
  ],
})
export class AppModule {}
