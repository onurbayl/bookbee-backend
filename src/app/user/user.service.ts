import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login.dto';
import * as firebaseAdmin from 'firebase-admin'
import axios from 'axios';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserBadRequestException } from './exceptions/user-bad-request.exception';
import { UserUnauthorizedException } from './exceptions/user-unauthorized.exception';
import { ShoppingCart } from '../shopping-cart/shopping-cart.entity';
import { ShoppingCartRepository } from '../shopping-cart/shopping-cart.repository';
import { GenreRepository } from '../genre/genre.repository';
import { In } from 'typeorm';

@Injectable()
export class UserService {
  constructor( //Injects repositories that you want to use
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    @InjectRepository(GenreRepository)
    private readonly genreRepository: GenreRepository,

    @InjectRepository(ShoppingCartRepository)
    private readonly shoppingCartRepository: ShoppingCartRepository,

  ) {}

  // Unban user by setting isDeleted to false
  async unbanUser(id: number, reqUid: string): Promise<User> {
    // Find the user by ID
    const user = await this.userRepository.findById(id);

    if (!user) {
      UserNotFoundException.byId(id);
    }

    // prevent self unban
    if(reqUid === user.uid){
      UserBadRequestException.selfUnban();
    }

    // Set isDeleted to false
    user.isDeleted = false;
    firebaseAdmin.auth().updateUser(user.uid, {
      disabled: false
    });

    // Save the updated user back to the database
    return await this.userRepository.save(user);
  }


  // Ban user by setting isDeleted to true
  async banUser(id: number, reqUid: string): Promise<User> {
    // Find the user by ID
    const user = await this.userRepository.findById(id)

    if (!user) {
      UserNotFoundException.byId(id);
    }

    // prevent self unban
    if(reqUid === user.uid){
      UserBadRequestException.selfBan();
    }

    // Set isDeleted to true
    user.isDeleted = true;
    firebaseAdmin.auth().revokeRefreshTokens(user.uid)
    firebaseAdmin.auth().updateUser(user.uid, {
      disabled: true
    });

    // Save the updated user back to the database
    return await this.userRepository.save(user);
  }

  // Method to update user profile
  async updateUser(id: number, updateUserDto: UpdateUserDto, isAdmin: boolean, reqUid: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      UserNotFoundException.byId(id);
    }

    if(reqUid !== user.uid && !isAdmin){
      UserUnauthorizedException.byNotPermitted()
    }

    // Update user profile fields
    /* if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.description) user.description = updateUserDto.description;
    if (updateUserDto.imagePath) user.imagePath = updateUserDto.imagePath; */
    const updatedUser = { ...user, ...updateUserDto }; // data mapping like above

    //return await this.userRepository.save(user);
    return this.userRepository.save(updatedUser);
  }

  //
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      UserNotFoundException.byId(id)
    }

    return user;
  }

  async getUserByUId(uid: string){
    const user = await this.userRepository.findByUId(uid);

    if (!user) {
      UserNotFoundException.byUId()
    }

    return user;
  }

  async getUserByToken(uid: string): Promise<User> {
    const user = await this.userRepository.findByUId(uid);

    if (!user) {
      UserNotFoundException.byUId()
    }

    return user;
  }
  
  async getAllUsers() {
    // Fetch all users from the database
    return this.userRepository.findAll();
  }

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, description, uid, imagePath, favoriteGenres } = createUserDto;

    const firebaseUser = await firebaseAdmin.auth().getUser(uid);
    if(!firebaseUser){
      UserUnauthorizedException.byInvalidUid(uid)
    }

    // Check if UID already exists
    const existingUser = await this.userRepository.findByUId(uid);

    if (existingUser) {
      UserBadRequestException.byExistingUid();
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      UserBadRequestException.byExistingEmail(email);
    }

    // Create new user entity
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.description = description;
    newUser.uid = uid;
    newUser.imagePath = imagePath;
    newUser.balance = 0.00;
    newUser.isDeleted = false;
    newUser.role = "user";

    // Associate favorite genres
    if (favoriteGenres && favoriteGenres.length > 0) {
      const genres = await this.genreRepository.findBy({ id: In(favoriteGenres) })
      newUser.favoriteGenres = genres;
    }

    // Save user to the database
    const savedUser = await this.userRepository.save(newUser);

    const newCart = new ShoppingCart();
    newCart.user = savedUser;
    await this.shoppingCartRepository.save(newCart);

    return savedUser;
  }


  // no need, registration will be in frontend
  async registerUser(registerUser: RegisterUserDto){
    console.log(registerUser)
    try {
      const userRecord = await firebaseAdmin.auth().createUser({
        displayName: registerUser.firstName,
        email: registerUser.email,
        password: registerUser.password,
      });

      console.log('User Record:', userRecord);
      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('User registration failed');
    }
  } 

  // not necessary
  async loginUser(payload: LoginDto){
    const { email, password } = payload;

    try {
      const result = await this.signInWithEmailAndPassword(email, password);
      if(!result)throw new Error("Incalid credentials")
      const { idToken, refreshToken, expiresIn } = result;
      return { idToken, refreshToken, expiresIn };
    } catch (error: any) {
      if(error.message.includes('EMAIL_NOT_FOUND')) {
        throw new Error('User not found.');
      } else if(error.message.includes('INVALID_PASSWORD')) {
        throw new Error('Invalid password.');
      } else {
        throw new Error(error.message);
      }
    }
  }

  // not necessary
  private async signInWithEmailAndPassword(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.KEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }
  // not necessary
  private async sendPostRequest(url: string, data: any){
    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.log('error', error)
    }
  }

  async transferBalance(senderUId: string, receiverId: number, amount: number): Promise<any> {
    if(isNaN(amount) || amount <= 0){
      UserBadRequestException.byInvalidAmount(amount)
    }

    const sender = await this.userRepository.findByUId(senderUId);
    if(!sender){
      UserNotFoundException.byUId()
    }

    const receiver = await this.userRepository.findById(receiverId);
    if(!receiver){
      UserNotFoundException.byId(receiverId)
    }
  
    if (sender.balance < amount) {
      UserBadRequestException.byNotEnoughBalance(sender.id)
    }

    if(sender.id === receiver.id){
      UserBadRequestException.selfTransfer()
    }
  
    // Perform the transfer
    sender.balance -= amount;
    receiver.balance += amount;
  
    // Save the updated users
    await this.userRepository.save(sender);
    await this.userRepository.save(receiver);
  
    return { message: 'Transfer successful', senderBalance: sender, receiverBalance: receiver };
  }
  

  /* // This is the most important part, necessary
  async validateRequest(req): Promise<boolean> {
    const authHeader = req.headers['authorization'];
    if(!authHeader){
      console.log('Authorization header not provided.');
      return false;
    }

    const [bearer, token] = authHeader.split(' ');
    if(bearer !== 'Bearer' || !token) {
      console.log('Invalid authorization format. Expected "Bearer <token>".')
      return false;
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      console.log('Decoded Token:', decodedToken);
      req.user = decodedToken;


      // Check if the user exists in the database by UID
      const user = await this.userRepository.findOne({ where: { uid: decodedToken.uid } });
      // If user doesn't exist or is deleted, deny authentication
      if (!user || user.isDeleted) {
        console.log('User is either banned or does not exist.');
        return false;
      }

      return true;
    } catch (error) {
      if(error.code === 'auth/id-token-expired'){
        console.log('Token has expired.')
      } else if(error.code === 'auth/invalid-id-token'){
        console.log('Invalid ID token provided.')
      } else {
        console.log('Error verifying token:', error);
      }
      return false;
    }
  } */
  // mock
  async findAll(){
    return "All users returned!"
  }

  /* async validateAdminRequest(request) : Promise<boolean> {
    const token = request.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      //throw new ForbiddenException('Authorization token is required.');
      return false;
    }

    try {
      // Verify the token and retrieve custom claims
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

      // Attach the user to the request for later use
      request.user = decodedToken;

      // Check if the user has the required role
      if (decodedToken.role !== 'admin') {
          //throw new ForbiddenException('Access denied. Admins only.');
          return false;
      }

      return true; // Access granted
    } catch (error) {
      //throw new ForbiddenException(`Access denied: ${error.message}`);
      return false;
    }
  } */

  // not necessary
  // it is like login, just not using email and password credentials. uses refresh token instead.
  async refreshAuthToken(refreshToken: string){
    try {
      const {
        id_token: idToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = await this.sendRefreshAuthTokenRequest(refreshToken);
      return {
        idToken,
        refreshToken: newRefreshToken,
        expiresIn,
      }
    } catch (error: any) {
      if (error.message.includes('INVALID_REFRESH_TOKEN')) {
        throw new Error(`Invalid refresh token: ${refreshToken}.`);
      } else {
        throw new Error('Failed to refresh token');
      }
    }
  }

  private async sendRefreshAuthTokenRequest(refreshToken: string){
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.KEY}`
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    return await this.sendPostRequest(url, payload)
  }

  // Function to assign a role to a user
  async setUserRole(uid: string, role: string) {
    try {
      //await firebaseAdmin.auth().setCustomUserClaims(uid, {});
      await firebaseAdmin.auth().setCustomUserClaims(uid, { role });
      console.log(`Role "${role}" assigned to user with UID: ${uid}`);
    } catch (error) {
      console.error('Error setting custom claims:', error);
    }
  }

  // Revoke user role by clearing custom claims
  async revokeUserRole(uid: string): Promise<void> {
    try {
      await firebaseAdmin.auth().setCustomUserClaims(uid, {}); // Clears all custom claims
      console.log(`Role revoked for user with UID: ${uid}`);
    } catch (error) {
      console.error('Error revoking user role:', error);
      throw error;
    }
  }

}