import { Injectable } from "@nestjs/common";
import { Brackets, DataSource, DeleteResult, Repository } from "typeorm";
import { FriendRequest } from "./friend-request.entity";


@Injectable()
export class FriendRequestRepository extends Repository<FriendRequest>{
    constructor(private readonly  dataSource: DataSource) {
        super(FriendRequest, dataSource.createEntityManager());
    }

    async findIncomingRequests(userId: number): Promise<FriendRequest[]> {
        return this.createQueryBuilder('friendRequest')
            .leftJoinAndSelect('friendRequest.sender', 'sender')
            .leftJoin('friendRequest.receiver', 'receiver')
            .where('receiver.id = :i_user', { i_user: userId })
            .andWhere('friendRequest.dateAnswered IS NULL')
            .getMany();
    }

    async findFriends(userId: number): Promise<FriendRequest[]> {
        return this.createQueryBuilder('friendRequest')
            .leftJoinAndSelect('friendRequest.sender', 'sender')
            .leftJoinAndSelect('friendRequest.receiver', 'receiver')
            .where(
                new Brackets(qb => {
                    qb.where('receiver.id = :i_user', { i_user: userId })
                      .orWhere('sender.id = :i_user', { i_user: userId });
                })
            )
            .andWhere('friendRequest.dateAnswered IS NOT NULL')
            .getMany();
    }

    async findByUserAndTarget(senderId: number, receiverId: number): Promise<FriendRequest | undefined> {
        return this.createQueryBuilder('friendRequest')
            .leftJoinAndSelect('friendRequest.sender', 'sender')
            .leftJoinAndSelect('friendRequest.receiver', 'receiver')
            .where('sender.id = :i_sender', { i_sender: senderId })
            .andWhere('receiver.id = :i_receiver', { i_receiver: receiverId })
            .getOne();
    }

    async deleteById(friendRequestId: number): Promise<DeleteResult> {
        return this.createQueryBuilder('friendRequest')
            .delete()
            .from(FriendRequest)
            .where('id = :i_friendRequest', { i_friendRequest: friendRequestId })
            .execute()
    }
}