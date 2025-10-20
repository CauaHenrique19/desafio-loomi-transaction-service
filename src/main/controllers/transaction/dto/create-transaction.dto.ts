import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDTO {
  @IsString()
  senderClientId: string;

  @IsString()
  receiverClientId: string;

  @IsNumber()
  amout: number;

  @IsString()
  description: string;
}
