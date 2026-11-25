import { Controller, Get, Post, Body, Patch, Delete, Param, ParseIntPipe, Res } from '@nestjs/common';
import type {Response} from 'express'
import { FactureService } from './facture.service.js';
import { CreateFactureDto } from './dto/create-facture.dto.js';
import { UpdateFactureDto } from './dto/update-facture.dto.js';
import { FacturePdfService } from './facture-pdf.service.js'

@Controller('facture')
export class FactureController {
  constructor(
    private readonly factureService: FactureService,
    private readonly facturePdfService: FacturePdfService,
  ) {}

  @Post()
  create(@Body() createFactureDto: CreateFactureDto) {
    return this.factureService.create(createFactureDto);
  }

  @Get()
  findAll() {
    return this.factureService.findAll();
  }

  @Get(':id/pdf')
  async generatePdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const pdf = await this.facturePdfService.generatePdf(id)

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline;filename="facture-${id}.pdf"`,
      'Content-Length': pdf.length,
    });

    return res.end(pdf);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.factureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFactureDto: UpdateFactureDto) {
    return this.factureService.update(+id, updateFactureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.factureService.remove(+id);
  }
}
