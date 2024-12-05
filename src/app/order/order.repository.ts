import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Order } from "./order.entity";

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(private readonly  dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    //Add custom repositories

}