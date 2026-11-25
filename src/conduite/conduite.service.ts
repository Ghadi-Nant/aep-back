import { Injectable } from '@nestjs/common';
import { CreateConduiteDto } from './dto/create-conduite.dto.js';
import { UpdateConduiteDto } from './dto/update-conduite.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ConduiteService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createConduiteDto: CreateConduiteDto) {
    return await this.prisma.conduite.create({
      data: createConduiteDto
    });
  }

  async findAll() {
    return await this.prisma.conduite.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.conduite.findUnique({
      where: { idConduite: id }
    });
  }

  async update(id: number, updateConduiteDto: UpdateConduiteDto) {
    return await this.prisma.conduite.update({
      where: { idConduite: id },
      data: updateConduiteDto
    });   
  }

  async remove(id: number) {
    return await this.prisma.conduite.delete({
      where: { idConduite: id }
    });
  }
}
