import { Injectable } from "@nestjs/common";
import { CustomerAddress } from "./customer-address.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class CustomerAddressRepository extends Repository<CustomerAddress> {
    constructor(private readonly  dataSource: DataSource) {
        super(CustomerAddress, dataSource.createEntityManager());
    }

    //Add custom repositories

}