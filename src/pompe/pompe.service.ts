import { Injectable } from '@nestjs/common';
import { CreatePompeDto } from './dto/create-pompe.dto.js';
import { UpdatePompeDto } from './dto/update-pompe.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PompeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPompeDto: CreatePompeDto) {
    const pompe = await this.prisma.pompe.create({ 
      data: createPompeDto });
    return pompe

  }

  async findAll() {
    return await this.prisma.pompe.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.pompe.findUnique({
      where: { idPompe: id }
    });
  }
  

  async update(id: number, updatePompeDto: UpdatePompeDto) {
    return await this.prisma.pompe.update({
      where: { idPompe: id },
      data: updatePompeDto

    });
  }

  async remove(id: number) {
    return await this.prisma.pompe.delete({
      where: { idPompe: id }
    });
  }

}