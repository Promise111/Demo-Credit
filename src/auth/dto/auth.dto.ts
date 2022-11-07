import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  repeatPassword: string;
}
