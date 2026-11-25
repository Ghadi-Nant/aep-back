import { Injectable } from '@nestjs/common';
import { CreateKiosqueDto } from './dto/create-kiosque.dto.js';
import { UpdateKiosqueDto } from './dto/update-kiosque.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class KiosqueService {

  constructor(private readonly prisma: PrismaService) {}
  
  async create(createKiosqueDto: CreateKiosqueDto) {
    const kiosque = await this.prisma.kiosque.create({
      data: createKiosqueDto
    })

    return kiosque;
  }

  async findAll() {
    return await this.prisma.kiosque.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.kiosque.findUnique({
      where: { idKiosque: id }
    });
  }

  async update(id: number, updateKiosqueDto: UpdateKiosqueDto) {
    const kiosque = await this.prisma.kiosque.update({
      data: updateKiosqueDto,
      where: { idKiosque: id }
    })

    return kiosque;
  }

  async remove(id: number) {
     return await this.prisma.kiosque.delete({
      where: { idKiosque: id }
    });
  }
}
