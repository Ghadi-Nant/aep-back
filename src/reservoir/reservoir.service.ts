import { Injectable } from '@nestjs/common';
import { CreateReservoirDto } from './dto/create-reservoir.dto.js';
import { UpdateReservoirDto } from './dto/update-reservoir.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReservoirService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createReservoirDto: CreateReservoirDto) {
    return await this.prisma.reservoir.create({
      data: createReservoirDto
    });
  }

  async findAll() {
    return await this.prisma.reservoir.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.reservoir.findUnique({
     where: { idReservoir: id }
    });
  }

  async update(id: number, updateReservoirDto: UpdateReservoirDto) {
    return await this.prisma.reservoir.update({
      where: { idReservoir: id },
      data: updateReservoirDto
    });
  }

  

  async remove(id: number) {
    return await this.prisma.reservoir.delete({
      where: { idReservoir: id }
    });
  }
}
