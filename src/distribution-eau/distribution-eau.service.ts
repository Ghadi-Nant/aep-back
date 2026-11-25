import { Injectable } from '@nestjs/common';
import { CreateDistributionEauDto } from './dto/create-distribution-eau.dto.js';
import { UpdateDistributionEauDto } from './dto/update-distribution-eau.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DistributionEauService {

  constructor(private readonly prisma: PrismaService){}

  async create(createDistributionEauDto: CreateDistributionEauDto) {
    const distributionEau = await this.prisma.distributionEau.create({
      data: createDistributionEauDto
    })

    return distributionEau;
  }

  async findAll() {
    return await this.prisma.distributionEau.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.distributionEau.findUnique({
      where: { idDistribution: id }
    });
  }

  async update(id: number, updateDistributionEauDto: UpdateDistributionEauDto) {
    const distributionEau = await this.prisma.distributionEau.update({
      data: updateDistributionEauDto,
      where: { idDistribution: id }
    })

    return distributionEau;
  }

  async remove(id: number) {
    return await this.prisma.distributionEau.delete({
      where: { idDistribution: id }
    });
  }
}
