import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ShoppingCart } from "./shopping-cart.entity";

@Injectable()
export class ShoppingCartRepository extends Repository<ShoppingCart> {
    constructor(private readonly  dataSource: DataSource) {
        super(ShoppingCart, dataSource.createEntityManager());
    }

    //Add custom repositories
    async findByUser(user_id: number): Promise<ShoppingCart | undefined>{
        return this.createQueryBuilder('shoppingCart')
        .leftJoinAndSelect('shoppingCart.user', 'user')
        .where( 'user.id = :i_user', {i_user: user_id} )
        .getOne();
    }

}