import { IsEmail, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { Genre } from "src/app/genre/genre.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
  
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsString()
    uid: string; // Firebase UID
  
    /* @IsOptional()
    @IsString()
    imagePath?: string;
  
    @IsOptional()
    @IsString()
    balance?: string;
  
    @IsOptional()
    isDeleted?: boolean; */
  }