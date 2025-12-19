import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { Account } from '../accounts/account.entity';
import { LedgerEntry } from '../ledger/ledger-entry.entity';
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account, LedgerEntry]),
  ],
  controllers: [TransactionsController], // 🔥 MUST
  providers: [TransactionsService],
})
export class TransactionsModule {}
