import { Injectable } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CommentService {
    constructor( //Injects repositories that you want to use
        @InjectRepository(CommentRepository)
        private readonly commentRepository: CommentRepository,
    ) {}

    //Add service methods

}