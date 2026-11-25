import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class UtilisateursSessionsService {
   constructor(private readonly prisma: PrismaService) {}

    async create (userId: number, refreshTokenHash: string, refreshTokenExpiresAt: Date) {
        const createdUserSession = await this.prisma.sessionUtilisateur.create({
            data: {
                idUtilisateur: userId,
                hashJetonRafraichissement: refreshTokenHash,
                expireLe: refreshTokenExpiresAt
            }
        })

        return createdUserSession;
    }

    async update (id: number, revokedAt: Date) {
        return await this.prisma.sessionUtilisateur.update({
            where: { idSession: id },
            data: {
                revoqueLe: revokedAt
            }
        })
    }
}
