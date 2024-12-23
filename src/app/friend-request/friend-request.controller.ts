import { Controller, Get, UseGuards, Request, Post, Param, Patch, Delete } from "@nestjs/common";
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

    @Post('send-request/:targetUserId')
    @UseGuards(AuthGuard)
    async sendRequest( @Param('targetUserId') targetUserId: number, @Request() req ) {
        const uId = req.user.uid;
        const result = this.friendRequestService.sendRequest(uId, targetUserId);
        return result;
    }

    @Patch('accept-request/:targetUserId')
    @UseGuards(AuthGuard)
    async acceptRequest( @Param('targetUserId') targetUserId: number, @Request() req ) {
        const uId = req.user.uid;
        const result = this.friendRequestService.acceptRequest(uId, targetUserId);
        return result;
    }

    @Delete('delete-friend-or-request/:targetUserId')
    @UseGuards(AuthGuard)
    async deleteRequest( @Param('targetUserId') targetUserId: number, @Request() req ) {
        const uId = req.user.uid;
        const result = this.friendRequestService.deleteRequest(uId, targetUserId);
        return result;
    }
}