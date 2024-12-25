import { Controller, Get, UseGuards, Post, Request, Patch, Delete, ForbiddenException, Param, NotFoundException, InternalServerErrorException, Next, Query, Body } from '@nestjs/common';
import { ReadStatusService } from "./read-status.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('api/v1/readStatus')
export class ReadStatusController {
    constructor(private readonly readStatusService : ReadStatusService) {}

    @Get('get-readStatus/:bookId')
    @UseGuards(AuthGuard)
    async getReadStatus( @Param('bookId') bookId: number, @Request() req ){
        const uId = req.user.uid;

        const result = await this.readStatusService.getReadStatus(bookId, uId);
        return result;
    }

    @Post('set-readStatus/:bookId/:status')
    @UseGuards(AuthGuard)
    async setReadStatus( @Param('bookId') bookId: number, @Param('status') status: string, @Request() req ){
        
        const uId = req.user.uid;

        if (status !== "Will Read" && status !== "Already Read" && status !== "Reading"){
            throw new ForbiddenException("Not valid status!");
        }

        const result = await this.readStatusService.setReadStatus(bookId, uId, status);
        return result;
    }

}