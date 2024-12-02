import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { FriendRequest } from "./friend-request.entity";


@Injectable()
export class FriendRequestRepository extends Repository<FriendRequest>{
    constructor(private readonly  dataSource: DataSource) {
        super(FriendRequest, dataSource.createEntityManager());
    }

    //Add custom repositories

}