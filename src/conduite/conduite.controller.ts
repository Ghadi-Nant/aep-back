import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConduiteService } from './conduite.service.js';
import { CreateConduiteDto } from './dto/create-conduite.dto.js';
import { UpdateConduiteDto } from './dto/update-conduite.dto.js';

@Controller('conduite')
export class ConduiteController {
  constructor(private readonly conduiteService: ConduiteService) {}

  @Post()
  create(@Body() createConduiteDto: CreateConduiteDto) {
    return this.conduiteService.create(createConduiteDto);
  }

  @Get()
  findAll() {
    return this.conduiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conduiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConduiteDto: UpdateConduiteDto) {
    return this.conduiteService.update(+id, updateConduiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conduiteService.remove(+id);
  }
}
