import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/user/user.service';
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private userService: UserService) {}
    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.userService.validateRequest(request);
    }
}