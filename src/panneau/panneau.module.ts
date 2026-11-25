import { Module } from '@nestjs/common';
import { PanneauService } from './panneau.service.js';
import { PanneauController } from './panneau.controller.js';

@Module({
  controllers: [PanneauController],
  providers: [PanneauService],
})
export class PanneauModule {}
