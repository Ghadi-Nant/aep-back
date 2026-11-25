import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAepDto } from './dto/create-aep.dto.js';
import { UpdateAepDto } from './dto/update-aep.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AepService {

  constructor (private readonly prisma: PrismaService){}

  async create(createAepDto: CreateAepDto) {
    console.log("creation pointe")
    console.log('Donnees recus: ', createAepDto)
    const { localites, ...aepData } = createAepDto;
    const aep = await this.prisma.aep.create({
      data: {
        ...aepData,
        localite: {
          create: localites.map(localite => ({
            nom: localite.nom,
          })),
        }
      },
      include: {
        localite: true
      }
    })

    return {
      success: true,
      message: 'Donnees aep enregistre avec succes',
      aep: aep
    }
  }

  async findAll() {
    console.log("Listage pointe")
    return await this.prisma.aep.findMany({
      include: {
        localite: true,
      },
      orderBy: {
        creeLe: "desc",
      },
    });
  }

  async findAllName() {
    console.log("Listage nom pointe")
    return await this.prisma.aep.findMany({
      select: {
        idAep: true,
        nomAep: true,
      }
    });
  }

  async findOne(id: number) {
    return await this.prisma.aep.findUnique({
      where: { idAep: id }
    })
  }

  async update(id: number, updateAepDto: UpdateAepDto) {
    console.log("Modification pointe")
    const { localites, ...aepData } = updateAepDto;

    return this.prisma.$transaction(async (tx) => {
      // Vérifier que l'AEP existe
      const aep = await tx.aep.findUnique({
        where: { idAep: id },
      });

      if (!aep) {
        throw new NotFoundException("AEP introuvable.");
      }

      // Mettre à jour les informations de l'AEP
      await tx.aep.update({
        where: { idAep: id },
        data: aepData,
      });

      // Synchroniser les localités si elles sont fournies
      if (localites !== undefined) {
        const idsExistants = localites
          .filter((l) => l.idLocalite !== undefined)
          .map((l) => l.idLocalite!);

        // Supprimer les localités retirées du formulaire
        await tx.localite.deleteMany({
          where: {
            aepId: id,
            idLocalite: {
              notIn: idsExistants,
            },
          },
        });

      // Ajouter ou modifier les localités
      for (const localite of localites) {
        if (localite.idLocalite !== undefined) {
          await tx.localite.updateMany({
            where: {
              idLocalite: localite.idLocalite,
              aepId: id,
            },
            data: {
              nom: localite.nom,
            },
          });
        } else {
          await tx.localite.create({
            data: {
              nom: localite.nom,
              aepId: id,
            },
          });
        }
      }
    }

    return tx.aep.findUnique({
      where: { idAep: id },
      include: { localite: true },
    });
  });
}

  async remove(id: number) {
    return this.prisma.aep.delete({
      where: { idAep: id },
    });
  }
}
