import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Discount } from "./discount.entity";
import { DiscountRepository } from "./discount.repository";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { UserModule } from "../user/user.module";
import { BookModule } from "../book/book.module";

@Module({
    imports: [TypeOrmModule.forFeature([Discount]), forwardRef(() => BookModule), UserModule],
    controllers: [DiscountController],
    providers: [DiscountService, DiscountRepository],
    exports: [DiscountRepository],
})
export class DiscountModule {}