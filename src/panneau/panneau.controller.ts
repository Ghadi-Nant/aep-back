import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PanneauService } from './panneau.service.js';
import { CreatePanneauDto } from './dto/create-panneau.dto.js';
import { UpdatePanneauDto } from './dto/update-panneau.dto.js';

@Controller('panneau')
export class PanneauController {
  constructor(private readonly panneauService: PanneauService) {}

  @Post()
  create(@Body() createPanneauDto: CreatePanneauDto) {
    return this.panneauService.create(createPanneauDto);
  }

  @Get()
  findAll() {
    return this.panneauService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.panneauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePanneauDto: UpdatePanneauDto) {
    return this.panneauService.update(+id, updatePanneauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panneauService.remove(+id);
  }
}
