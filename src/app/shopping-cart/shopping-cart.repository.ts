import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ShoppingCart } from "./shopping-cart.entity";

@Injectable()
export class ShoppingCartRepository extends Repository<ShoppingCart> {
    constructor(private readonly  dataSource: DataSource) {
        super(ShoppingCart, dataSource.createEntityManager());
    }

    //Add custom repositories

}