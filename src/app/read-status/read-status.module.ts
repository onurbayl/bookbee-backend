import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadStatus } from "./read-status.entity";
import { ReadStatusRepository } from "./read-status.repository";
import { ReadStatusController } from "./read-status.controller";
import { ReadStatusService } from "./read-status.service";

@Module({
    imports: [TypeOrmModule.forFeature([ReadStatus])],
    controllers: [ReadStatusController],
    providers: [ReadStatusService, ReadStatusRepository],
    exports: [ReadStatusRepository],
})
export class ReadStatusModule {}