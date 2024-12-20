import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerAddress } from "./customer-address.entity";
import { CustomerAddressRepository } from "./customer-address.repository";
import { CustomerAddressController } from "./customer-address.controller";
import { CustomerAddressService } from "./customer-address.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddress]), UserModule],
  controllers: [CustomerAddressController],
  providers: [CustomerAddressService, CustomerAddressRepository],
  exports: [CustomerAddressRepository],
})
export class CustomerAddressModule {}