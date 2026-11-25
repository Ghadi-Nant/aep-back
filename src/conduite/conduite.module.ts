import { Module } from '@nestjs/common';
import { ConduiteService } from './conduite.service.js';
import { ConduiteController } from './conduite.controller.js';

@Module({
  controllers: [ConduiteController],
  providers: [ConduiteService],
})
export class ConduiteModule {}
