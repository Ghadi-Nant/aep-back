import { Injectable } from '@nestjs/common';
import { CreateReleveDto } from './dto/create-releve.dto.js';
import { UpdateReleveDto } from './dto/update-releve.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReleveService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createReleveDto: CreateReleveDto) {
    const releve = await this.prisma.releve.create({
      data: createReleveDto
    })

    return releve;
  }

  async findAll() {
    return await this.prisma.releve.findMany({
      include: {
        compteur: {
          include: {
            abonne: {
              include: {
                aep: true
              }
            }
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const releve =  await this.prisma.releve.findUnique({
      where: { idReleve: id },
      include: {
        compteur: {
          include: {
            abonne: {
              include: {
                aep: true
              }
            }
          }
        }
      }
    });

    /*const parametre = await this.prisma.parametre.findFirst()

    return {
      dateReleve: releve?.dateReleve,
      nomAbonne: releve?.compteur.abonne.nom + ' ' + releve?.compteur.abonne.prenom,
      numCompteur: releve?.compteur.numCompteur,
      adresse: releve?.compteur.abonne.adresse,
      ancienIndex: releve?.ancienIndex,
      nouvelIndex: releve?.nouvelIndex,
      prix: releve?.compteur.abonne.aep.prixEauBp,
      delaiPresentation: parametre?.delaiPresentation! ?? 3,
      delaiLimite: parametre?.delaiLimite ?? 10,
      delaiCoupure: parametre?.delaiCoupure ?? 15,
      fraisFixe: parametre?.fraisFixeFacture ?? 500
    }*/
  }

  async update(id: number, updateReleveDto: UpdateReleveDto) {
    const releve = await this.prisma.releve.update({
      data: updateReleveDto,
      where: { idReleve: id }
    })

    return releve;
  }

  async remove(id: number) {
    return await this.prisma.releve.delete({
      where: { idReleve: id }
    });
  }
}
