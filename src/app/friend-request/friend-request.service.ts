import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequestRepository } from "./friend-request.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { FriendRequest } from "./friend-request.entity";
import { User } from "../user/user.entity";


@Injectable()
export class FriendRequestService {
    constructor(
        @InjectRepository(FriendRequestRepository)
        private readonly friendRequestRepository: FriendRequestRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    async getFriends(userUId: string) {
        const user = await this.userRepository.findByUId(userUId)
        if(user == null) {
            UserNotFoundException.byUId();
        }

        // Find accepted sent requests and accepted received requests
        const friends: FriendRequest[] = await this.friendRequestRepository.findFriends(user.id);
        
        // Collect User objects
        let users: User[] = [];
        for (let friend of friends) {
            if (friend.sender.id == user.id) {
                users.push(friend.receiver);
            } else {
                users.push(friend.sender);
            }
        }
        return users;
    }

    async sendRequest(userUId: string, targetUserId: number) {
        const user = await this.userRepository.findByUId(userUId)
        if(user == null) {
            UserNotFoundException.byUId();
        }

        const target = await this.userRepository.findById(targetUserId);
        if(target == null) {
            UserNotFoundException.byId(targetUserId);
        }

        // Check if friendship already exists
        let friendship: FriendRequest = await this.friendRequestRepository.findByUserAndTarget(user.id, target.id);
        
        if ( friendship == null ) {
            // - No: create a new friendship then save
            friendship = new FriendRequest();
            friendship.sender = user;
            friendship.receiver = target;
            friendship.dateRequest = new Date();
            friendship.dateAnswered = null;
            await this.friendRequestRepository.save(friendship);
        }
        
        // Return request date
        return friendship.dateRequest;
    }
}