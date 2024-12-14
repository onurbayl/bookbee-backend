import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterUserDto {
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
    @Length(8, 20)
    password: string;

}