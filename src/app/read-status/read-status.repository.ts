import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ReadStatus } from "./read-status.entity";

@Injectable()
export class ReadStatusRepository extends Repository<ReadStatus> {
    constructor(private readonly  dataSource: DataSource) {
        super(ReadStatus, dataSource.createEntityManager());
    }

    //Add custom repositories

}