import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ChangerMotDePasseDto, CreateUtilisateurDto } from './dto/create-utilisateur.dto.js';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RoleUtilisateur } from '../generated/prisma/enums.js';
import { FournisseurAuth } from '../generated/prisma/enums.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateursService {

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUtilisateurDto) {
    if (dto.email) {
      const existeEmail = await this.prisma.utilisateur.findUnique({ where: { email: dto.email } });
      if (existeEmail) {
        throw new ConflictException("Cet email est déjà utilisé.");
      }
    }

    if (dto.telephone) {
      const existeTelephone = await this.prisma.utilisateur.findUnique({ where: { telephone: dto.telephone } });
      if (existeTelephone) {
        throw new ConflictException("Ce numéro de téléphone est déjà utilisé.");
      }
    }

    const hashMotDePasse = await bcrypt.hash('123456789', 10);

    return this.prisma.utilisateur.create({
      data: {
        nom: dto.nom,
        email: dto.email,
        telephone: dto.telephone,
        roleUtilisateur: dto.roleUtilisateur || RoleUtilisateur.UTILISATEUR,
        identites: {
          create: {
            fournisseur: FournisseurAuth.MOT_DE_PASSE,
            idFournisseur: dto.email || dto.telephone || 'inconnu',
            hashMotDePasse: hashMotDePasse,
          },
        },
      },
      select: {
        idUtilisateur: true,
        nom: true,
        email: true,
        telephone: true,
        roleUtilisateur: true,
        estActif: true,
        creeLe: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.utilisateur.findMany({
      select: {
        idUtilisateur: true,
        nom: true,
        email: true,
        telephone: true,
        roleUtilisateur: true,
        estActif: true,
        creeLe: true,
      },
    });
  }

  async findOne(id: number) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { idUtilisateur: id },
      select: {
        idUtilisateur: true,
        nom: true,
        email: true,
        telephone: true,
        roleUtilisateur: true,
        estActif: true,
        creeLe: true,
      },
    });

    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec l'ID #${id} introuvable.`);
    }

    return utilisateur;
  }

  async update(id: number, dto: UpdateUtilisateurDto) {
    await this.findOne(id)

    if (dto.email) {
      const existe = await this.prisma.utilisateur.findFirst({
        where: { email: dto.email, NOT: { idUtilisateur: id } },
      });
      if (existe) throw new ConflictException("Cet email est déjà utilisé par un autre utilisateur.");
    }

    if (dto.telephone) {
      const existe = await this.prisma.utilisateur.findFirst({
        where: { telephone: dto.telephone, NOT: { idUtilisateur: id } },
      });
      if (existe) throw new ConflictException("Ce numéro de téléphone est déjà utilisé par un autre utilisateur.");
    }

    return this.prisma.utilisateur.update({
      where: { idUtilisateur: id },
      data: dto,
      select: {
        idUtilisateur: true,
        nom: true,
        email: true,
        telephone: true,
        roleUtilisateur: true,
        estActif: true,
        //misAJourLe: true,
      },
    });
  }

  async changePassword(id: number, dto: ChangerMotDePasseDto) {
    const identite = await this.prisma.identiteAuth.findFirst({
      where: { idUtilisateur: id, fournisseur: 'MOT_DE_PASSE' },
    });

    if (!identite || !identite.hashMotDePasse) {
      throw new NotFoundException("Aucun compte avec mot de passe associé à cet utilisateur.");
    }

    const motDePasseValide = await bcrypt.compare(dto.ancienMotDePasse, identite.hashMotDePasse);
    if (!motDePasseValide) {
      throw new UnauthorizedException("L'ancien mot de passe est incorrect.");
    }

    const nouveauHash = await bcrypt.hash(dto.nouveauMotDePasse, 10);

    await this.prisma.identiteAuth.update({
      where: { idIdentite: identite.idIdentite },
      data: { hashMotDePasse: nouveauHash },
    });

    return { message: "Mot de passe mis à jour avec succès." };
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.utilisateur.delete({
      where: {
        idUtilisateur: id
      }
    });
    return { message: "Utilisateur supprime avec succès." };
  }
}
