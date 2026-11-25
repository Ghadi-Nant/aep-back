import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VersementKiosqueService } from './versement-kiosque.service.js';
import { CreateVersementKiosqueDto } from './dto/create-versement-kiosque.dto.js';
import { UpdateVersementKiosqueDto } from './dto/update-versement-kiosque.dto.js';

@Controller('versement-kiosque')
export class VersementKiosqueController {
  constructor(private readonly versementKiosqueService: VersementKiosqueService) {}

  @Post()
  create(@Body() createVersementKiosqueDto: CreateVersementKiosqueDto) {
    return this.versementKiosqueService.create(createVersementKiosqueDto);
  }

  @Get()
  findAll() {
    return this.versementKiosqueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.versementKiosqueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVersementKiosqueDto: UpdateVersementKiosqueDto) {
    return this.versementKiosqueService.update(+id, updateVersementKiosqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.versementKiosqueService.remove(+id);
  }
}
