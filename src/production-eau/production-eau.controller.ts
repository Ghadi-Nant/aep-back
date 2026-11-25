import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductionEauService } from './production-eau.service.js';
import { CreateProductionEauDto } from './dto/create-production-eau.dto.js';
import { UpdateProductionEauDto } from './dto/update-production-eau.dto.js';

@Controller('production-eau')
export class ProductionEauController {
  constructor(private readonly productionEauService: ProductionEauService) {}

  @Post()
  create(@Body() createProductionEauDto: CreateProductionEauDto) {
    return this.productionEauService.create(createProductionEauDto);
  }

  @Get()
  findAll() {
    return this.productionEauService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productionEauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductionEauDto: UpdateProductionEauDto) {
    return this.productionEauService.update(+id, updateProductionEauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productionEauService.remove(+id);
  }
}
