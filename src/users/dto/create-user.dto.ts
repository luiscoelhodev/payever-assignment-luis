import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmpty()
  readonly id: number;

  @IsNotEmpty()
  @IsString()
  readonly first_name: string;

  @IsNotEmpty()
  @IsString()
  readonly last_name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly avatar: string;
}
