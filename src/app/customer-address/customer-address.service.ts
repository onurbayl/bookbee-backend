import { Injectable } from "@nestjs/common";
import { CustomerAddressRepository } from "./customer-address.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CustomerAddressService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CustomerAddressRepository)
        private readonly customerAddressRepository: CustomerAddressRepository,
    ) {}

    //Add service methods

}
