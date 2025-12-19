import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Account } from '../accounts/account.entity';

export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

@Entity('ledger_entries')
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  account: Account;

  @Column({ type: 'text' })
  entryType: string;
 

  @Column('decimal', { precision: 18, scale: 2 })
  amount: string;

  @CreateDateColumn()
  createdAt: Date;
}
