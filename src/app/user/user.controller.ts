import { Controller, Get, Post, Put, Patch, Delete, Request,Param, NotFoundException, ForbiddenException,InternalServerErrorException, Next, Query, Body, ValidationPipe, UsePipes, UseGuards, BadRequestException, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';  // Import the service
import { User } from './user.entity';  // Import the User entity
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserUnauthorizedException } from './exceptions/user-unauthorized.exception';
import { FirebaseAuthInterceptor } from 'src/interceptors/firebase-auth.interceptor';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(@Request() req) {
    // Check if an admin
    if (req.user.role !== 'admin') {
      UserUnauthorizedException.byNotAdmin()
    }
    return await this.userService.getAllUsers();
  }

  // Example case for interceptor use
  @Get('test')
  @UseInterceptors(FirebaseAuthInterceptor)
  getUserProfile(@Request() req: any) {
    return {
      firebaseUid: req.firebaseUid
    };
  }

  @Get('bytoken')
  @UseGuards(AuthGuard)
  async getUserByToken(@Request() req) {
    const uid = req.user.uid
    return await this.userService.getUserByToken(uid);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') Id: number, @Request() req) {
    const user = await this.userService.getUserById(Id);

    const { id, name, email, imagePath, description, favoriteGenres } = user;
    
    if (req.user.role !== 'admin') {
      return { id, name, email, imagePath, description, favoriteGenres }
    }

    return user
    
  }
  
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const isAdmin = req.user.role === 'admin';
    return this.userService.updateUser(id, updateUserDto, isAdmin, req.user.uid);
  }

  // Create user in database
  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() createUserDto: CreateUserDto){
    return await this.userService.createUser(createUserDto);
  }

  @Post('set-role')
  @UseGuards(AuthGuard)
  async setUserRole(@Body() body: { uid: string; role: string }, @Request() req) {
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      UserUnauthorizedException.byNotAdmin()
    }

    const { uid, role } = body;

    if (!uid || !role) {
      throw new BadRequestException('UID and role are required.');
    }

    const allowedRoles = ["user", "publisher", "admin"];
    if (!allowedRoles.includes(role)) {
      console.error(`Invalid role: ${role}`);
      throw new BadRequestException(`Invalid role`);
    }

    try {
      await this.userService.setUserRole(uid, role);
      const user = await this.userService.getUserByUId(uid)
      await this.userService.updateUser(user.id, {role}, isAdmin, req.user.uid);
      return { message: `Role "${role}" has been assigned to user with UID: ${uid}` };
    } catch (error) {
      throw new BadRequestException(`Failed to set role: ${error.message}`);
    }
  }

  @Post('revoke-role')
  @UseGuards(AuthGuard)
  async revokeUserRole(@Body() body: { uid: string }, @Request() req) {
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      UserUnauthorizedException.byNotAdmin()
    }

    const { uid } = body;

    if (!uid) {
      throw new BadRequestException('UID is required.');
    }

    try {
      await this.userService.revokeUserRole(uid);
      const user = await this.userService.getUserByUId(uid)
      await this.userService.updateUser(user.id, {role:"user"}, isAdmin, req.user.uid);
      return { message: `Role has been revoked for user with UID: ${uid}` };
    } catch (error) {
      throw new BadRequestException(`Failed to revoke role: ${error.message}`);
    }
  }

  @Post('/unban/:id')
  @UseGuards(AuthGuard) 
  async unbanUser(@Param('id') id: number, @Request() req, ) {

    // Check if an admin
    if (req.user.role !== 'admin') {
      UserUnauthorizedException.byNotAdmin()
    }

    // Call the service to unban the user by setting isDeleted to false
    return this.userService.unbanUser(id, req.user.uid);
  }

  @Post('/ban/:id')
  @UseGuards(AuthGuard)
  async banUser(@Param('id') id: number, @Request() req) {

    // Check if an admin
    if (req.user.role !== 'admin') { 
      UserUnauthorizedException.byNotAdmin()
    }

    // Call the service to ban the user by setting isDeleted to true
    return this.userService.banUser(id, req.user.uid);
  }

  // THIS IS TO REGISTER USER TO FIREBASE
  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  registerUser(@Body() registerUserDTo: RegisterUserDto){
    return this.userService.registerUser(registerUserDTo);
  }

  // LOGIN TO FIREBASE
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  login(@Body() loginDto: LoginDto) {
    return this.userService.loginUser(loginDto);
  }

  // REFRESH TOKEN FROM FIREBASE
  @Post('refresh-auth')
  refreshAuth(@Query('refreshToken') refreshToken: string) {
    return this.userService.refreshAuthToken(refreshToken);
  }
}