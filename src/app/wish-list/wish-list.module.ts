import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishList } from "./wish-list.entity";
import { WishListRepository } from "./wish-list.repository";
import { WishListService } from "./wish-list.service";
import { WishListController } from "./wish-list.controller";

@Module({
    imports: [TypeOrmModule.forFeature([WishList])],
    controllers: [WishListController],
    providers: [WishListService, WishListRepository],
    exports: [WishListRepository],
  })
  export class WishListModule {}