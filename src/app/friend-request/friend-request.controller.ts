import { Controller } from "@nestjs/common";
import { FriendRequestService } from "./friend-request.service";

@Controller('api/v1/friend')
export class FriendRequestController {
    constructor(private readonly friendRequestService: FriendRequestService) {}

    //Add api endpoints

}