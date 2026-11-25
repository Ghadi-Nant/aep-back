import { Module } from '@nestjs/common';
import { ReleveService } from './releve.service.js';
import { ReleveController } from './releve.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReleveController],
  providers: [ReleveService],
})
export class ReleveModule {}
