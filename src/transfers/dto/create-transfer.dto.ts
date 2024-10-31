import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsUUID()
  receiver_account_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'The minimum amount is 0.01.' })
  amount: number;
}
