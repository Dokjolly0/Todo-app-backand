import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class AddUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  picture: string;

  @IsEmail()
  username: string;

  @MinLength(8)
  password: string;
}

export class LoginDTO {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
