import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const account = this.accountRepository.create(dto);
    return this.accountRepository.save(account);
  }

 async getAccount(id: string): Promise<Account> {
  const account = await this.accountRepository.findOneBy({ id });

  if (!account) {
    throw new Error('Account not found');
  }

  return account;
}

}
