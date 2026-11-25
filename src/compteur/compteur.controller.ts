import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompteurService } from './compteur.service.js';
import { CreateCompteurDto } from './dto/create-compteur.dto.js';
import { UpdateCompteurDto } from './dto/update-compteur.dto.js';

@Controller('compteur')
export class CompteurController {
  constructor(private readonly compteurService: CompteurService) {}

  @Post()
  create(@Body() createCompteurDto: CreateCompteurDto) {
    return this.compteurService.create(createCompteurDto);
  }

  @Get()
  findAll() {
    return this.compteurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compteurService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompteurDto: UpdateCompteurDto) {
    return this.compteurService.update(+id, updateCompteurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compteurService.remove(+id);
  }
}
