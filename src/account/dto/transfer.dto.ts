import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(100)
  amount: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  account_number: string;
}
