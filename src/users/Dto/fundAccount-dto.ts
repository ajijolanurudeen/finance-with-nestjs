import { IsNumber } from 'class-validator';

export class FundAccountDto {
  @IsNumber()
  amount: number;
}