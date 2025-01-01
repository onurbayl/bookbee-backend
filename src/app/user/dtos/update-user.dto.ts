import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() // Optional field since not all updates may include the name
  @IsString()
  @Length(1, 255) // Assuming name length limit to 255 characters
  name?: string;

  @IsOptional() // Optional field
  @IsString()
  @Length(1, 2048) // Assuming description length limit to 2048 characters
  description?: string;

  @IsOptional() // Optional field for image path
  @IsString()
  @Length(1, 255) // Assuming image path length limit to 255 characters
  imagePath?: string;

  @IsOptional()
  @IsString()
  balance?: number;

  @IsOptional()
  @IsString()
  role?: string;
}