import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadStatus } from "./read-status.entity";
import { ReadStatusRepository } from "./read-status.repository";
import { ReadStatusController } from "./read-status.controller";
import { ReadStatusService } from "./read-status.service";
import { UserModule } from '../user/user.module';
import { BookModule } from '../book/book.module';

@Module({
    imports: [TypeOrmModule.forFeature([ReadStatus]), UserModule, BookModule],
    controllers: [ReadStatusController],
    providers: [ReadStatusService, ReadStatusRepository],
    exports: [ReadStatusRepository],
})
export class ReadStatusModule {}