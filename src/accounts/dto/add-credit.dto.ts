import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddCreditDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'The minimum amount is 0.01.' })
  amount: number;
}
