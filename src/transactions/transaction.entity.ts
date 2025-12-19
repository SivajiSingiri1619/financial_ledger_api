import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Account } from '../accounts/account.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, { nullable: true })
  sourceAccount: Account;

  @ManyToOne(() => Account, { nullable: true })
  destinationAccount: Account;

  @Column('decimal', { precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'text' })
type: string;

@Column({ type: 'text' })
status: string;


  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
