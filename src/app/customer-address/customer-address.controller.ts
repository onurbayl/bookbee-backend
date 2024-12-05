import { Controller } from "@nestjs/common";
import { CustomerAddressService } from "./customer-address.service";

@Controller('api/v1/customerAddress')
export class CustomerAddressController {
    constructor(private readonly customerAddressService: CustomerAddressService) {}

    //Add api endpoints

}