import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { UserRepository } from 'src/app/user/user.repository';
import { UserService } from 'src/app/user/user.service';
import * as firebaseAdmin from 'firebase-admin';
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(@InjectRepository(UserRepository)
        private readonly userRepository: UserRepository) {}

    


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
    
        // Check if the user exists in the database by UID
        const user = await this.userRepository.findByUId(decodedToken.uid);
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
    }


    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);

        /* const isValid = this.userService.validateRequest(request);
        if (!isValid){
            throw new ForbiddenException('You are not authorized to access this resource');
        }
        return isValid; */
    }
}