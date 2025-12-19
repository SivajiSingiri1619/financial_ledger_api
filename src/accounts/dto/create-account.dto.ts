import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AccountType } from '../account.entity';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
