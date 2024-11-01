import { IsNumber } from 'class-validator';

export class WithdrawFundsDto {
  @IsNumber()
  amount: number;
}