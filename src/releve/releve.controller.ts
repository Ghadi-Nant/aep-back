import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReleveService } from './releve.service.js';
import { CreateReleveDto } from './dto/create-releve.dto.js';
import { UpdateReleveDto } from './dto/update-releve.dto.js';

@Controller('releve')
export class ReleveController {
  constructor(private readonly releveService: ReleveService) {}

  @Post()
  create(@Body() createReleveDto: CreateReleveDto) {
    return this.releveService.create(createReleveDto);
  }

  @Get()
  findAll() {
    return this.releveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReleveDto: UpdateReleveDto) {
    return this.releveService.update(+id, updateReleveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releveService.remove(+id);
  }
}
