import { Injectable } from '@nestjs/common';
import { CreateForageDto } from './dto/create-forage.dto.js';
import { UpdateForageDto } from './dto/update-forage.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ForageService {

  constructor (private readonly prisma: PrismaService){}

  async create(createForageDto: CreateForageDto) {
    const forage = await this.prisma.forage.create({
    data : createForageDto
    })

    return forage
  }

  async findAll() {
    return await this.prisma.forage.findMany();
  }

  async findAllName() {
    return await this.prisma.forage.findMany({
      select: {
        idForage: true,
      }
    });
  }

  async findOne(id: number) {
    const forage = await this.prisma.forage.findUnique({
      where: {idForage: id }
    });

    return forage
  }

  async update(id: number, updateForageDto: UpdateForageDto) {
    const forage = await this.prisma.forage.update({
      where: {idForage: id },
      data: updateForageDto
    });

    return forage
  }

  async remove(id: number) {
    const forage = await this.prisma.forage.delete({
      where: {idForage: id }
    });

    return forage
  }
}
