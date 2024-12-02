import { Controller } from "@nestjs/common";
import { ReadStatusService } from "./read-status.service";

@Controller('api/v1/readStatus')
export class ReadStatusController {
    constructor(private readonly readStatusService : ReadStatusService) {}

    //Add api endpoints

}