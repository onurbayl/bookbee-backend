import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginDto } from './dtos/login.dto';
import * as firebaseAdmin from 'firebase-admin'
import axios from 'axios';

@Injectable()
export class UserService {
  constructor( //Injects repositories that you want to use
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

  ) {}

  //Service methods
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

  // This is the most important part, necessary
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
  }
  // mock
  async findAll(){
    return "All users returned!"
  }

  async validateAdminRequest(request) : Promise<boolean> {
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
  }

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