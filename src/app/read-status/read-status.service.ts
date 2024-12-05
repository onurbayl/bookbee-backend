import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReadStatusRepository } from "./read-status.repository";

@Injectable()
export class ReadStatusService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(ReadStatusRepository)
        private readonly readStatusRepository: ReadStatusRepository,
    ) {}

    //Add service methods

}