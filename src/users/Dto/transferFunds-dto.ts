import { IsNumber, IsInt } from 'class-validator';

export class TransferFundsDto {
  
  recipientId: string;

  @IsNumber()
  amount: number;
}
