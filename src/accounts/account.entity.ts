import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
}

export enum AccountType {
  SAVINGS = 'SAVINGS',
  CHECKING = 'CHECKING',
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

 @Column({ type: 'text' })
  type: string;


  @Column()
  currency: string;

 @Column({ type: 'text', default: 'ACTIVE' })
status: string;


  @CreateDateColumn()
  createdAt: Date;
}
