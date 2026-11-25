import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MaintenanceService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createMaintenanceDto: CreateMaintenanceDto, photo: string) {
    const maintenance = await this.prisma.maintenance.create({
      data: {
        ...createMaintenanceDto,
        photo
      }
    })

    return maintenance;
  }

  async findAll() {
    return await this.prisma.maintenance.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.maintenance.findUnique({
      where: { idMaintenance: id }
    });
  }

  async update(id: number, updateMaintenanceDto: UpdateMaintenanceDto, photo: string) {
    const existingMaintenance = await this.findOne(id)

    if(!existingMaintenance) {
      throw new BadRequestException("Maintenance non trouvée !");
    }
    
    const maintenance = await this.prisma.maintenance.update({
      data: {
        ...updateMaintenanceDto,
        photo
      },
      where: { idMaintenance: id }
    });

    return maintenance;
  }

  async remove(id: number) {
    return await this.prisma.maintenance.delete({
      where: { idMaintenance: id }
    });
  }
}
