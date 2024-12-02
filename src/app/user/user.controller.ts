import { Controller, Get, Post, Patch, Delete, Param, NotFoundException, InternalServerErrorException, Next, Query, Body } from '@nestjs/common';
import { UserService } from './user.service';  // Import the service
import { User } from './user.entity';  // Import the Book entity

@Controller('api/v1/user') // "api/v1" is standart naming convension for version, using it like this good practice
export class UserController {
  constructor(private readonly userService: UserService) {} //Rarely needed another service, if need arise ask me.

  //API points

}