import { Controller, Get, UseGuards, Post, Request, Patch, Delete, ForbiddenException, Param, NotFoundException, InternalServerErrorException, Next, Query, Body, UseInterceptors } from '@nestjs/common';
import { ReadStatusService } from "./read-status.service";
import { AuthGuard } from "src/guards/auth.guard";
import { FirebaseAuthInterceptor } from 'src/interceptors/firebase-auth.interceptor';

@Controller('api/v1/readStatus')
export class ReadStatusController {
    constructor(private readonly readStatusService : ReadStatusService) {}

    @Get('get-readStatus/:userId')
    async getReadStatus( @Param('userId') userId: number){

        return await this.readStatusService.getReadStatus(userId);

    }

    @Post('set-readStatus/:bookId/status/:status_number')
    @UseGuards(AuthGuard)
    async setReadStatus( @Param('bookId') bookId: number, @Param('status_number') status_number: number, @Request() req ){
        
        const uId = req.user.uid;

        return await this.readStatusService.setReadStatus(bookId, uId, status_number);

    }

    @Get('get-readStatus-byBook/:bookId')
    @UseInterceptors(FirebaseAuthInterceptor)
    async getReadStatusByBook( @Param('bookId') bookId: number, @Request() req ){
        const uId = req.firebaseUid;
        return await this.readStatusService.getReadStatusByBook(bookId, uId);

    }

}