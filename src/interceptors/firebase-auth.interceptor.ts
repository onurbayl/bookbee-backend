import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import * as firebaseAdmin from 'firebase-admin';
  
  @Injectable()
  export class FirebaseAuthInterceptor implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      if (!authHeader) {
        request.firebaseUid = null;
        return next.handle();
      }
  
      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        request.firebaseUid = null;
        return next.handle();
      }
  
      try {
        // Verify the token
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        request.firebaseUid = decodedToken.uid;
      } catch (error) {
        console.log('Token could not be verified');
        request.firebaseUid = null;
      }
  
      return next.handle();
    }
  }
  