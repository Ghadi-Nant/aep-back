import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoupureEauService } from './coupure-eau.service.js';
import { CreateCoupureEauDto } from './dto/create-coupure-eau.dto.js';
import { UpdateCoupureEauDto } from './dto/update-coupure-eau.dto.js';

@Controller('coupure-eau')
export class CoupureEauController {
  constructor(private readonly coupureEauService: CoupureEauService) {}

  @Post()
  create(@Body() createCoupureEauDto: CreateCoupureEauDto) {
    return this.coupureEauService.create(createCoupureEauDto);
  }

  @Get()
  findAll() {
    return this.coupureEauService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coupureEauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoupureEauDto: UpdateCoupureEauDto) {
    return this.coupureEauService.update(+id, updateCoupureEauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coupureEauService.remove(+id);
  }
}
