import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PointEauService } from './point-eau.service.js';
import { CreatePointEauDto } from './dto/create-point-eau.dto.js';
import { UpdatePointEauDto } from './dto/update-point-eau.dto.js';

@Controller('point-eau')
export class PointEauController {
  constructor(private readonly pointEauService: PointEauService) {}

  @Post()
  create(@Body() createPointEauDto: CreatePointEauDto) {
    return this.pointEauService.create(createPointEauDto);
  }

  @Get()
  findAll() {
    return this.pointEauService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointEauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointEauDto: UpdatePointEauDto) {
    return this.pointEauService.update(+id, updatePointEauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointEauService.remove(+id);
  }
}
