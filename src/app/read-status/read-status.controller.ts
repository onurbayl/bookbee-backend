import { Controller, Get, UseGuards, Post, Request, Patch, Delete, ForbiddenException, Param, NotFoundException, InternalServerErrorException, Next, Query, Body } from '@nestjs/common';
import { ReadStatusService } from "./read-status.service";
import { AuthGuard } from "src/guards/auth.guard";

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

}