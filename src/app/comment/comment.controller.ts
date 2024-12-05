import { Controller } from "@nestjs/common";
import { CommentService } from "./comment.service";

@Controller('api/v1/comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    //Add api endpoints

}