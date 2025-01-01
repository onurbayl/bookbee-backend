import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendRequestRepository } from "./friend-request.repository";
import { UserRepository } from "../user/user.repository";
import { UserNotFoundException } from "../user/exceptions/user-not-found.exception";
import { FriendRequest } from "./friend-request.entity";
import { User } from "../user/user.entity";
import { FriendRequestNotFoundException } from "./exceptions/friend-request-not-found.exception";
import { FriendRequestForbiddenException } from "./exceptions/friend-request-forbidden.exception";


@Injectable()
export class FriendRequestService {
    constructor(
        @InjectRepository(FriendRequestRepository)
        private readonly friendRequestRepository: FriendRequestRepository,

        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    async getFriendRequests(userUId: string) {
        const user = await this.userRepository.findByUId(userUId);
        if(user == null) {
            UserNotFoundException.byUId();
        }

        // Find pending received requests
        const friends: FriendRequest[] = await this.friendRequestRepository.findIncomingRequests(user.id);
        
        // Collect User objects
        let users: User[] = [];
        for (let friend of friends) {
            users.push(friend.sender);
        }
        return users;
    }

    async getFriends(userUId: string) {
        const user = await this.userRepository.findByUId(userUId);
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
        const user = await this.userRepository.findByUId(userUId);
        if(user == null) {
            UserNotFoundException.byUId();
        }

        const target = await this.userRepository.findById(targetUserId);
        if(target == null) {
            UserNotFoundException.byId(targetUserId);
        }

        // Check self request
        if(user.id == target.id) {
            FriendRequestForbiddenException.selfRequest(user.id);
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

    async acceptRequest(userUId: string, targetUserId: number) {
        const user = await this.userRepository.findByUId(userUId);
        if(user == null) {
            UserNotFoundException.byUId();
        }

        const target = await this.userRepository.findById(targetUserId);
        if(target == null) {
            UserNotFoundException.byId(targetUserId);
        }
         
        // Check if friendship exists
        let friendship: FriendRequest = await this.friendRequestRepository.findByUserAndTarget(user.id, target.id);
        if ( friendship == null ) {
            FriendRequestNotFoundException.bySenderAndReceiver(user.id, target.id);
        }

        // Check if the friendship is already established
        if ( friendship.dateAnswered != null ) {
            FriendRequestForbiddenException.bySenderAndReceiver(user.id, target.id);
        }
        
        // Respond to the request
        friendship.dateAnswered = new Date();
        const response = await this.friendRequestRepository.save(friendship);
        
        // Return response date
        return response.dateAnswered;
    }

    async deleteRequest(userUId: string, targetUserId: number) {
        const user = await this.userRepository.findByUId(userUId);
        if(user == null) {
            UserNotFoundException.byUId();
        }

        const target = await this.userRepository.findById(targetUserId);
        if(target == null) {
            UserNotFoundException.byId(targetUserId);
        }
         
        // Check if friendship exists
        let friendship: FriendRequest = await this.friendRequestRepository.findByUserAndTarget(user.id, target.id);
        if ( friendship == null ) {
            FriendRequestNotFoundException.bySenderAndReceiver(user.id, target.id);
        }

        // Remove friendship
        await this.friendRequestRepository.deleteById(friendship.id);
        
        // Return response date
        return { message: `The friendship between users with ids ${user.id} and ${target.id} no longer exists.` };
    }
}