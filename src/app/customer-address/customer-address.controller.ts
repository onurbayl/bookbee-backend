import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { CustomerAddressService } from "./customer-address.service";
import { AuthGuard } from "src/guards/auth.guard";

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

}