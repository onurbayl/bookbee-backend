import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8, 20)
    password: string;


}