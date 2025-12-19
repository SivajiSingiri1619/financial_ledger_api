import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DepositDto } from './dto/deposit.dto';
import { Transaction, TransactionStatus, TransactionType } from './transaction.entity';
import { Account } from '../accounts/account.entity';
import { LedgerEntry, EntryType } from '../ledger/ledger-entry.entity';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';



@Injectable()
export class TransactionsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(LedgerEntry)
    private readonly ledgerRepository: Repository<LedgerEntry>,
  ) {}

  async deposit(depositDto: DepositDto) {
    return this.dataSource.transaction(async (manager) => {
      const account = await manager.findOne(Account, {
        where: { id: depositDto.accountId },
      });

      if (!account) {
        throw new Error('Account not found');
      }

      // 1️⃣ Create transaction (PENDING)
      const transaction = manager.create(Transaction, {
        destinationAccount: account,
        amount: depositDto.amount.toString(),
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        description: 'Deposit',
      });

      await manager.save(transaction);

      // 2️⃣ Create ledger entry (CREDIT)
      const ledgerEntry = manager.create(LedgerEntry, {
        account: account,
        entryType: EntryType.CREDIT,
        amount: depositDto.amount.toString(),
      });

      await manager.save(ledgerEntry);

      // 3️⃣ Mark transaction as COMPLETED
      transaction.status = TransactionStatus.COMPLETED;
      await manager.save(transaction);

      return {
        transactionId: transaction.id,
        status: transaction.status,
      };
    });
  }

  async withdraw(withdrawDto: WithdrawDto) {
  return this.dataSource.transaction(async (manager) => {
    const account = await manager.findOne(Account, {
      where: { id: withdrawDto.accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // 🔹 Calculate current balance
    const result = await manager
      .createQueryBuilder(LedgerEntry, 'ledger')
      .select(
        `COALESCE(SUM(
          CASE 
            WHEN ledger.entryType = :credit THEN ledger.amount
            WHEN ledger.entryType = :debit THEN -ledger.amount
          END
        ), 0)`,
        'balance',
      )
      .where('ledger.accountId = :accountId', {
        accountId: withdrawDto.accountId,
      })
      .setParameters({
        credit: EntryType.CREDIT,
        debit: EntryType.DEBIT,
      })
      .getRawOne();

    const balance = Number(result.balance);

    // 🔴 Prevent overdraft
    if (balance < withdrawDto.amount) {
      throw new Error('Insufficient balance');
    }

    // 1️⃣ Create transaction (PENDING)
    const transaction = manager.create(Transaction, {
      sourceAccount: account,
      amount: withdrawDto.amount.toString(),
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      description: 'Withdrawal',
    });

    await manager.save(transaction);

    // 2️⃣ Create ledger entry (DEBIT)
    const ledgerEntry = manager.create(LedgerEntry, {
      account: account,
      entryType: EntryType.DEBIT,
      amount: withdrawDto.amount.toString(),
    });

    await manager.save(ledgerEntry);

    // 3️⃣ Mark transaction COMPLETED
    transaction.status = TransactionStatus.COMPLETED;
    await manager.save(transaction);

    return {
      transactionId: transaction.id,
      status: transaction.status,
      remainingBalance: balance - withdrawDto.amount,
    };
  });
}


async transfer(transferDto: TransferDto) {
  return this.dataSource.transaction(async (manager) => {
    const { sourceAccountId, destinationAccountId, amount } = transferDto;

    if (sourceAccountId === destinationAccountId) {
      throw new Error('Source and destination accounts must be different');
    }

    // 1️⃣ Fetch accounts
    const sourceAccount = await manager.findOne(Account, {
      where: { id: sourceAccountId },
    });

    const destinationAccount = await manager.findOne(Account, {
      where: { id: destinationAccountId },
    });

    if (!sourceAccount || !destinationAccount) {
      throw new Error('Account not found');
    }

    // 2️⃣ Calculate source balance
    const result = await manager
      .createQueryBuilder(LedgerEntry, 'ledger')
      .select(
        `COALESCE(SUM(
          CASE 
            WHEN ledger.entryType = :credit THEN ledger.amount
            WHEN ledger.entryType = :debit THEN -ledger.amount
          END
        ), 0)`,
        'balance',
      )
      .where('ledger.accountId = :accountId', {
        accountId: sourceAccountId,
      })
      .setParameters({
        credit: EntryType.CREDIT,
        debit: EntryType.DEBIT,
      })
      .getRawOne();

    const balance = Number(result.balance);

    // 🔴 Prevent overdraft
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // 3️⃣ Create transaction (PENDING)
    const transaction = manager.create(Transaction, {
      sourceAccount,
      destinationAccount,
      amount: amount.toString(),
      type: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      description: 'Internal transfer',
    });

    await manager.save(transaction);

    // 4️⃣ Ledger entry: DEBIT source
    const debitEntry = manager.create(LedgerEntry, {
      account: sourceAccount,
      entryType: EntryType.DEBIT,
      amount: amount.toString(),
    });

    // 5️⃣ Ledger entry: CREDIT destination
    const creditEntry = manager.create(LedgerEntry, {
      account: destinationAccount,
      entryType: EntryType.CREDIT,
      amount: amount.toString(),
    });

    await manager.save([debitEntry, creditEntry]);

    // 6️⃣ Mark transaction COMPLETED
    transaction.status = TransactionStatus.COMPLETED;
    await manager.save(transaction);

    return {
      transactionId: transaction.id,
      status: transaction.status,
    };
  });
}


}
