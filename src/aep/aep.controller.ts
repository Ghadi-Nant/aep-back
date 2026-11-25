import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AepService } from './aep.service.js';
import { CreateAepDto } from './dto/create-aep.dto.js';
import { UpdateAepDto } from './dto/update-aep.dto.js';

@Controller('aep')
export class AepController {
  constructor(private readonly aepService: AepService) {}

  @Post()
  create(@Body() createAepDto: CreateAepDto) {
    return this.aepService.create(createAepDto);
  }

  @Get()
  findAll() {
    return this.aepService.findAll();
  }

  @Get('nom')
  findAllName() {
    return this.aepService.findAllName();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aepService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAepDto: UpdateAepDto) {
    return this.aepService.update(+id, updateAepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aepService.remove(+id);
  }
}
