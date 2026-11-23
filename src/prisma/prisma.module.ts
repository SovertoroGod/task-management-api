import { Module } from "@nestjs/common";
import { PrimsaService } from "./prisma.service.js";

@Module({
    providers: [PrimsaService],
    exports:[PrimsaService]
})

export class PrismaModule { }