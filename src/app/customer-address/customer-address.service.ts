import { Injectable } from "@nestjs/common";
import { CustomerAddressRepository } from "./customer-address.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { createNewAddressDto } from "./dtos/create-new-address-dto";
import { CustomerAddress } from "./customer-address.entity";
import { CustomerAddressInvalidDataException } from "./exceptions/customer-address-invalid-data.exception";

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

    async addAddressToUser(inputData: createNewAddressDto, userUId: string){

        const user = await this.userRepository.findByUId(userUId);
        if( user == null ){
            UserNotFoundException.byUId();
        }

        if( inputData.addressInfo == undefined || inputData.addressInfo.length == 0 ){
            CustomerAddressInvalidDataException.byMissingData();
        }

        const customerAddress = await this.customerAddressRepository.findActiveByUser(user.id);
        if( customerAddress != null ){
            customerAddress.endDate = new Date();
            customerAddress.current = false;
            await this.customerAddressRepository.save(customerAddress);
        }

        const newCustomerAddress = new CustomerAddress();
        newCustomerAddress.addressInfo = inputData.addressInfo;
        newCustomerAddress.startDate = new Date();
        newCustomerAddress.endDate = null;
        newCustomerAddress.current = true;
        newCustomerAddress.user = user;

        return await this.customerAddressRepository.save(newCustomerAddress);
    }

}
