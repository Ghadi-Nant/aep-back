import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReservoirService } from './reservoir.service.js';
import { CreateReservoirDto } from './dto/create-reservoir.dto.js';
import { UpdateReservoirDto } from './dto/update-reservoir.dto.js';

@Controller('reservoir')
export class ReservoirController {
  constructor(private readonly reservoirService: ReservoirService) {}

  @Post()
  create(@Body() createReservoirDto: CreateReservoirDto) {
    return this.reservoirService.create(createReservoirDto);
  }

  @Get()
  findAll() {
    return this.reservoirService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservoirService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservoirDto: UpdateReservoirDto) {
    return this.reservoirService.update(+id, updateReservoirDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservoirService.remove(+id);
  }
}
