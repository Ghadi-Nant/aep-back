import { Module } from '@nestjs/common';
import { PompeService } from './pompe.service.js';
import { PompeController } from './pompe.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';


@Module({
  imports: [PrismaModule],
  controllers: [PompeController],
  providers: [PompeService],
})

export class PompeModule {}
