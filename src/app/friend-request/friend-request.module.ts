import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendRequest } from "./friend-request.entity";
import { FriendRequestService } from "./friend-request.service";
import { FriendRequestRepository } from "./friend-request.repository";
import { FriendRequestController } from "./friend-request.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), UserModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, FriendRequestRepository],
  exports: [FriendRequestRepository],
})
export class FriendRequestModule {}