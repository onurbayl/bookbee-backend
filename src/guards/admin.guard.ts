import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
//import * as firebaseAdmin from 'firebase-admin'
@Injectable()
export class AdminGuard /* implements CanActivate */{
    /* constructor(private userService: UserService) {}

    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.userService.validateAdminRequest(request);
    }
*/
} 