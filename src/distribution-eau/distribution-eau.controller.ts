import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DistributionEauService } from './distribution-eau.service.js';
import { CreateDistributionEauDto } from './dto/create-distribution-eau.dto.js';
import { UpdateDistributionEauDto } from './dto/update-distribution-eau.dto.js';

@Controller('distribution-eau')
export class DistributionEauController {
  constructor(private readonly distributionEauService: DistributionEauService) {}

  @Post()
  create(@Body() createDistributionEauDto: CreateDistributionEauDto) {
    return this.distributionEauService.create(createDistributionEauDto);
  }

  @Get()
  findAll() {
    return this.distributionEauService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.distributionEauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDistributionEauDto: UpdateDistributionEauDto) {
    return this.distributionEauService.update(+id, updateDistributionEauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.distributionEauService.remove(+id);
  }
}
