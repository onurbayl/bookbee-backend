import { Controller, Get, Post, Patch, Delete, Param, NotFoundException, InternalServerErrorException, Next, Query, Body, ValidationPipe, UsePipes, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';  // Import the service
import { User } from './user.entity';  // Import the Book entity
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('api/v1/user') // "api/v1" is standart naming convension for version, using it like this good practice
export class UserController {
  constructor(private readonly userService: UserService) {} //Rarely needed another service, if need arise ask me.

  //API points
  // no need registration will be in frontend
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  registerUser(@Body() registerUserDTo: RegisterUserDto){
    return this.userService.registerUser(registerUserDTo);
  }

  // not necessary
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() loginDto: LoginDto) {
    return this.userService.loginUser(loginDto);
  }

  // can accept refresh token from body as well
  // not necessary
  @Post('refresh-auth')
  refreshAuth(@Query('refreshToken') refreshToken: string) {
    return this.userService.refreshAuthToken(refreshToken);
  }

  @Post('set-role')
  @UseGuards(AdminGuard)
  async setUserRole(@Body() body: { uid: string; role: string }) {
    const { uid, role } = body;

    if (!uid || !role) {
      throw new BadRequestException('UID and role are required.');
    }

    try {
      await this.userService.setUserRole(uid, role);
      return { message: `Role "${role}" has been assigned to user with UID: ${uid}` };
    } catch (error) {
      throw new BadRequestException(`Failed to set role: ${error.message}`);
    }
  }

  @Post('revoke-role')
  @UseGuards(AdminGuard)
  async revokeUserRole(@Body() body: { uid: string }) {
    const { uid } = body;

    if (!uid) {
      throw new BadRequestException('UID is required.');
    }

    try {
      await this.userService.revokeUserRole(uid);
      return { message: `Role has been revoked for user with UID: ${uid}` };
    } catch (error) {
      throw new BadRequestException(`Failed to revoke role: ${error.message}`);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(){
    return this.userService.findAll();
  }

}