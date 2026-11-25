import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoupureEauDto } from './dto/create-coupure-eau.dto.js';
import { UpdateCoupureEauDto } from './dto/update-coupure-eau.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UniteDuree } from '../generated/prisma/enums.js';

type Periode = {
  dateDebut: Date | string;
  dateFin?: Date | string | null;
  duree?: number | null;
  uniteDuree?: UniteDuree | null;
};

const MS_PAR_UNITE: Partial<Record<UniteDuree, number>> = {
  SECONDE: 1_000,
  MINUTE: 60_000,
  HEURE: 3_600_000,
  JOUR: 86_400_000,
};

@Injectable()
export class CoupureEauService {

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCoupureEauDto) {
    const periode = this.resoudrePeriode(dto);

    return this.prisma.coupureEau.create({
      data: {
        dateDebut: dto.dateDebut,
        raison: dto.raison,
        idAep: dto.idAep,
        ...periode,
      },
    });;
  }

  async findAll() {
    return await this.prisma.coupureEau.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.coupureEau.findUnique({
      where: { idCoupure: id }
    });
  }

   async update(id: number, dto: UpdateCoupureEauDto) {
    const existant = await this.prisma.coupureEau.findUnique({ where: { idCoupure: id } });

    if (!existant) {
      throw new NotFoundException('Coupure introuvable.');
    }

    const periode = this.resoudrePeriode({
      dateDebut: dto.dateDebut ?? existant.dateDebut,
      duree: dto.duree ?? existant.duree,
      uniteDuree: dto.uniteDuree ?? existant.uniteDuree,
    });

    const { dateDebut, duree, uniteDuree, ...autres } = dto;

    return this.prisma.coupureEau.update({
      where: { idCoupure: id },
      data: { ...autres, ...(dateDebut ? { dateDebut } : {}), ...periode },
    });
  }

  async remove(id: number) {
    return await this.prisma.coupureEau.delete({
      where: { idCoupure: id }
    });
  }

  private resoudrePeriode(p: Periode) {
    const { duree, uniteDuree } = p;

    if ((duree == null) !== (uniteDuree == null)) {
      throw new BadRequestException('La durée et son unité doivent être renseignées ensemble.');
    }

    // Ni durée ni unité : coupure en cours
    if (duree == null || uniteDuree == null) {
      return { dateFin: null, duree: null, uniteDuree: null };
    }

    if (duree <= 0) {
      throw new BadRequestException('La durée doit être supérieure à 0.');
    }

    return {
      dateFin: this.ajouterDuree(new Date(p.dateDebut), duree, uniteDuree),
      duree,
      uniteDuree,
    };
  }

  private ajouterDuree(debut: Date, duree: number, unite: UniteDuree): Date {
    const ms = MS_PAR_UNITE[unite];
    if (ms !== undefined) {
      return new Date(debut.getTime() + duree * ms);
    }

    // Mois et années : calendrier, donc entiers uniquement
    if (!Number.isInteger(duree)) {
      throw new BadRequestException(
        'Pour une durée en mois ou en années, saisissez un nombre entier.',
      );
    }
    return this.ajouterMois(debut, unite === UniteDuree.ANNEE ? duree * 12 : duree);
  }

  /** 31 janvier + 1 mois = 28 ou 29 février (et non le 3 mars) */
  private ajouterMois(date: Date, n: number): Date {
    const d = new Date(date.getTime());
    const jour = d.getUTCDate();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + n);
    const dernierJour = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(jour, dernierJour));
    return d;
  }
}
