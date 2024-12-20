import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { FriendRequestService } from "./friend-request.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/friend')
export class FriendRequestController {
    constructor(private readonly friendRequestService: FriendRequestService) {}

    @Get('get-friends')
    @UseGuards(AuthGuard)
    async getFriends( @Request() req ) {
        const uId = req.user.uid;
        const result = this.friendRequestService.getFriends(uId);
        return result;
    }
}