import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AbonneService } from './abonne.service.js';
import { CreateAbonneDto } from './dto/create-abonne.dto.js';
import { UpdateAbonneDto } from './dto/update-abonne.dto.js';

@Controller('abonne')
export class AbonneController {
  constructor(private readonly abonneService: AbonneService) {}

  @Post()
  create(@Body() createAbonneDto: CreateAbonneDto) {
    return this.abonneService.create(createAbonneDto);
  }

  @Get()
  findAll() {
    return this.abonneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abonneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbonneDto: UpdateAbonneDto) {
    return this.abonneService.update(+id, updateAbonneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abonneService.remove(+id);
  }
}
