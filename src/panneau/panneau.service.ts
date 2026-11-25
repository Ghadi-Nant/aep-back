import { Injectable } from '@nestjs/common';
import { CreatePanneauDto } from './dto/create-panneau.dto.js';
import { UpdatePanneauDto } from './dto/update-panneau.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PanneauService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createPanneauDto: CreatePanneauDto) {
    return await this.prisma.panneau.create({ 
      data: createPanneauDto
    });
  }

  async findAll() {
    return await this.prisma.panneau.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.panneau.findUnique({
      where: { idPanneau: id}
    });
  }   
  

  async update(id: number, updatePanneauDto: UpdatePanneauDto) {
    return await this.prisma.panneau.update({
      where: { idPanneau: id },
      data: updatePanneauDto
    });
  }

  async remove(id: number) {
    return await this.prisma.panneau.delete({
      where: { idPanneau: id }
    });
  }
  
}
