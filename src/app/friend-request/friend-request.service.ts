import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequestRepository } from "./friend-request.repository";

@Injectable()
export class FriendRequestService {
    constructor(
        @InjectRepository(FriendRequestRepository)
        private readonly friendRequestRepository: FriendRequestRepository,
    ) {}

    //Add service methods

}