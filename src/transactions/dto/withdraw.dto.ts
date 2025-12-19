import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class WithdrawDto {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
