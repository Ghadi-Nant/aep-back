import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  create(){
    return this.appService.create()
  }
}
