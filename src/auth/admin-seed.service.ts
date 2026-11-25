import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { RoleUtilisateur } from "../generated/prisma/enums";
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt'

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
     private readonly logger = new Logger(AdminSeedService.name)

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        console.log('adddd')
    }

    async onApplicationBootstrap() {
        console.log('executing admin seed')
        await this.seedInitialAdmin();
    }

    private async seedInitialAdmin () {
        const adminEmail = this.configService.get<string>('INITIAL_ADMIN_EMAIL')
        const adminPassword = this.configService.get<string>('INITIAL_ADMIN_PASSWORD')

        if(!adminEmail || !adminPassword) {
            this.logger.warn(`L'email initial ou le mot de passe initial n'est pas fournit.`)
            return;
        }

        console.log('1')
        const existingAdmin = await this.prisma.utilisateur.findFirst({
            where: { 
                //email: adminEmail,
                roleUtilisateur: { in: [RoleUtilisateur.ADMIN]}, 
            },
        });


        console.log('1.5')
        if (existingAdmin) {
            this.logger.warn(`Un compte administrateur existe deja.`);
            return;
        }

        console.log('2')
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        console.log('3')
        await this.prisma.utilisateur.create({
            data: {
                nom: 'Super Admin',
                email: adminEmail,
                roleUtilisateur: 'ADMIN',
                identites: {
                    create: {
                        fournisseur: 'MOT_DE_PASSE',
                        idFournisseur: 'adminEmail',
                        hashMotDePasse: hashedPassword,
                    },
                },
            },
        });
        console.log('4')

        this.logger.log(` Premier administrateur créé avec succès (${adminEmail})`);
    }

}