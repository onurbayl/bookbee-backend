import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Injectable()
export class CartItemRepository extends Repository<CartItem> {
    constructor(private readonly  dataSource: DataSource) {
        super(CartItem, dataSource.createEntityManager());
    }

    //Add custom repositories

}