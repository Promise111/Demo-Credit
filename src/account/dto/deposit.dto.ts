import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DepositDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(100)
  amount: number;
}
