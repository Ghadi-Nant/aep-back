import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForageService } from './forage.service.js';
import { CreateForageDto } from './dto/create-forage.dto.js';
import { UpdateForageDto } from './dto/update-forage.dto.js';

@Controller('forage')
export class ForageController {
  constructor(private readonly forageService: ForageService) {}

  @Post()
  create(@Body() createForageDto: CreateForageDto) {
    return this.forageService.create(createForageDto);
  }

  @Get()
  findAll() {
    return this.forageService.findAll();
  }

  @Get('nom')
  findAllName() {
    return this.forageService.findAllName();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.forageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForageDto: UpdateForageDto) {
    return this.forageService.update(+id, updateForageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.forageService.remove(+id);
  }
}
