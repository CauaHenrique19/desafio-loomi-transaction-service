import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDTO {
  @IsString()
  senderClientId: string;

  @IsString()
  receiverClientId: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;
}
