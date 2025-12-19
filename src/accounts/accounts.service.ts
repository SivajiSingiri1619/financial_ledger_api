import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { LedgerEntry, EntryType } from '../ledger/ledger-entry.entity';




@Injectable()
export class AccountsService {
 constructor(
  @InjectRepository(Account)
  private readonly accountRepository: Repository<Account>,

  @InjectRepository(LedgerEntry)
  private readonly ledgerRepository: Repository<LedgerEntry>,
) {}


  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
  const account = this.accountRepository.create(createAccountDto);
  return this.accountRepository.save(account);
}

async getAccountWithBalance(accountId: string) {
  const account = await this.accountRepository.findOne({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const result = await this.ledgerRepository
    .createQueryBuilder('ledger')
    .select(
      `COALESCE(SUM(
        CASE 
          WHEN ledger.entryType = :credit THEN ledger.amount
          WHEN ledger.entryType = :debit THEN -ledger.amount
        END
      ), 0)`,
      'balance',
    )
    .where('ledger.accountId = :accountId', { accountId })
    .setParameters({
      credit: EntryType.CREDIT,
      debit: EntryType.DEBIT,
    })
    .getRawOne();

  return {
    ...account,
    balance: result.balance,
  };
}


}

