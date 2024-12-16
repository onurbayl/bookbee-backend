import { Controller, Get, Post, Put, Patch, Delete, Request,Param, NotFoundException, ForbiddenException,InternalServerErrorException, Next, Query, Body, ValidationPipe, UsePipes, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';  // Import the service
import { User } from './user.entity';  // Import the User entity
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserUnauthorizedException } from './exceptions/user-unauthorized.exception';

@Controller('api/v1/user') // "api/v1" is standart naming convension for version, using it like this good practice
export class UserController {
  constructor(private readonly userService: UserService) {} //Rarely needed another service, if need arise ask me.


  @UseGuards(AuthGuard) // Use your custom AuthGuard here
  @Post('/unban/:id')
  async unbanUser(
    @Param('id') id: number,        // The ID of the user to delete
    @Request() req,  // Access the request object to get the user from the custom AuthGuard
  ) {

    // Check if is an admin
    if (req.user.role !== 'admin') {  // Compare Firebase UID with database UID, or check admin role
      UserUnauthorizedException.byNotAdmin()
    }

    // Call the service to "unban" the user by setting isDeleted to false
    return this.userService.unbanUser(id, req.user.uid);
  }


  @Post('/ban/:id')
  @UseGuards(AuthGuard) // Use your custom AuthGuard here
  async banUser(
    @Param('id') id: number,        // The ID of the user to delete
    @Request() req,  // Access the request object to get the user from the custom AuthGuard
  ) {

    // Check if is an admin
    if (req.user.role !== 'admin') {  // Compare Firebase UID with database UID, or check admin role
      UserUnauthorizedException.byNotAdmin()
    }

    // Call the service to "ban" the user by setting isDeleted to true
    return this.userService.banUser(id, req.user.uid);
  }


  @UseGuards(AuthGuard) // Use your custom AuthGuard here
  @Put(':id')
  async updateUser(
    @Param('id') id: number,        // The ID of the user to update
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,  // Access the request object to get the user from the custom AuthGuard
  ) {
    const isAdmin = req.user.role === 'admin';
    return this.userService.updateUser(id, updateUserDto, isAdmin, req.user.uid);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(@Request() req) {
    // Check if is an admin
    if (req.user.role !== 'admin') {
      UserUnauthorizedException.byNotAdmin()
    }
    return await this.userService.getAllUsers();
  }

  // Create user in database
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() createUserDto: CreateUserDto){
    return await this.userService.createUser(createUserDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return await this.userService.getUserById(id);
  }

  @Get('/uid/:uid')
  async getUserByUId(@Param('uid') uid: string) {
    return await this.userService.getUserByUId(uid);
  }

  
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
  //@UseGuards(AdminGuard)
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

  /* @Get('test')
  @UseGuards(AuthGuard)
  findAll(){
    return this.userService.findAll();
  } */

}