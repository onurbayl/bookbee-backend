import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Discount } from "./discount.entity";
import { DiscountRepository } from "./discount.repository";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Discount])],
    controllers: [DiscountController],
    providers: [DiscountService, DiscountRepository],
    exports: [DiscountRepository],
})
export class DiscountModule {}