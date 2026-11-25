import { Injectable } from '@nestjs/common';
import { CreateProductionEauDto } from './dto/create-production-eau.dto.js';
import { UpdateProductionEauDto } from './dto/update-production-eau.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductionEauService {

  constructor(private readonly prisma: PrismaService){}

  async create(createProductionEauDto: CreateProductionEauDto) {
    const productionEau = await this.prisma.productionEau.create({
      data: createProductionEauDto
    })

    return productionEau;
  }

  async findAll() {
    return await this.prisma.productionEau.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.productionEau.findUnique({
      where: { idProduction: id }
    });
  }

  async update(id: number, updateProductionEauDto: UpdateProductionEauDto) {
    const productionEau = await this.prisma.productionEau.update({
      data: updateProductionEauDto,
      where: { idProduction: id }
    })

    return productionEau;
  }

  async remove(id: number) {
    return await this.prisma.productionEau.delete({
      where: { idProduction: id }
    });
  }
}
