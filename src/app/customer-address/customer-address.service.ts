import { Injectable } from "@nestjs/common";
import { CustomerAddressRepository } from "./customer-address.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";

@Injectable()
export class CustomerAddressService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CustomerAddressRepository)
        private readonly customerAddressRepository: CustomerAddressRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) {}

    async getActiveAddressForUser(userUId: string){

        const user = await this.userRepository.findByUId(userUId);
        if( user == null ){
            UserNotFoundException.byUId();
        }

        const customerAddress = await this.customerAddressRepository.findActiveByUser(user.id);

        return customerAddress;
    }

}
