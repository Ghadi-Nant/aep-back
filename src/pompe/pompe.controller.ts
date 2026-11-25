import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PompeService } from './pompe.service.js';
import { CreatePompeDto } from './dto/create-pompe.dto.js';
import { UpdatePompeDto } from './dto/update-pompe.dto.js';

@Controller('pompe')
export class PompeController {
  constructor(private readonly pompeService: PompeService) {}

  @Post()
  create(@Body() createPompeDto: CreatePompeDto) {
    return this.pompeService.create(createPompeDto);
  }

  @Get()
  findAll() {
    return this.pompeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pompeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePompeDto: UpdatePompeDto) {
    return this.pompeService.update(+id, updatePompeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pompeService.remove(+id);
  }
}
