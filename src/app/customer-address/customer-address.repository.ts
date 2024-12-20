import { Injectable } from "@nestjs/common";
import { CustomerAddress } from "./customer-address.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CustomerAddressRepository extends Repository<CustomerAddress> {
    constructor(private readonly  dataSource: DataSource) {
        super(CustomerAddress, dataSource.createEntityManager());
    }

    async findActiveByUser(userId: number): Promise<CustomerAddress>{
        return this.createQueryBuilder('customerAddress')
        .leftJoinAndSelect('customerAddress.user', 'user')
        .where('user.id = :user_id', {user_id: userId})
        .andWhere('customerAddress.current')
        .getOne();
    }

}