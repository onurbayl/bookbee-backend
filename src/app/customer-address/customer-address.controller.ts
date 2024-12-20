import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { CustomerAddressService } from "./customer-address.service";
import { AuthGuard } from "src/guards/auth.guard";
import { createNewAddressDto } from "./dtos/create-new-address-dto";

@Controller('api/v1/customerAddress')
export class CustomerAddressController {
    constructor(private readonly customerAddressService: CustomerAddressService) {}

    @Get('get-address')
    @UseGuards(AuthGuard)
    async getActiveAddressForUser( @Request() req ){
        const uId = req.user.uid;
        const result = this.customerAddressService.getActiveAddressForUser(uId);
        return result
    }

    @Post('add-address')
    @UseGuards(AuthGuard)
    async addAddressToUser( @Body() inputData: createNewAddressDto, @Request() req ){
        const uId = req.user.uid;
        const result = this.customerAddressService.addAddressToUser(inputData, uId);
        return result
    }

}