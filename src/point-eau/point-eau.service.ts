import { Injectable } from '@nestjs/common';
import { CreatePointEauDto } from './dto/create-point-eau.dto.js';
import { UpdatePointEauDto } from './dto/update-point-eau.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PointEauService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createPointEauDto: CreatePointEauDto) {
    const pointEau = await this.prisma.pointEau.create({
      data: createPointEauDto
    })

    return pointEau
  }

  async findAll() {
    return await this.prisma.pointEau.findMany()
  }

  async findOne(id: number) {
    return  await this.prisma.pointEau.findUnique({
      where: { idPointEau: id }
    })
  }

  async update(id: number, updatePointEauDto: UpdatePointEauDto) {
    const pointEau = await this.prisma.pointEau.update({
      data: updatePointEauDto,
      where: { idPointEau: id }
    })

    return pointEau;
  }

  async remove(id: number) {
    return await this.prisma.pointEau.delete({
      where: { idPointEau: id }
    })
  }
}
