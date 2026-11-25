import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KiosqueService } from './kiosque.service.js';
import { CreateKiosqueDto } from './dto/create-kiosque.dto.js';
import { UpdateKiosqueDto } from './dto/update-kiosque.dto.js';

@Controller('kiosque')
export class KiosqueController {
  constructor(private readonly kiosqueService: KiosqueService) {}

  @Post()
  create(@Body() createKiosqueDto: CreateKiosqueDto) {
    return this.kiosqueService.create(createKiosqueDto);
  }

  @Get()
  findAll() {
    return this.kiosqueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kiosqueService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKiosqueDto: UpdateKiosqueDto) {
    return this.kiosqueService.update(+id, updateKiosqueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kiosqueService.remove(+id);
  }
}
