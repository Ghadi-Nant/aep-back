import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConnexionDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { createHash, randomBytes, randomInt, randomUUID } from 'crypto';
import { UtilisateursSessionsService } from '../utilisateurs-sessions/utilisateurs-sessions.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { UtilisateursService } from '../utilisateurs/utilisateurs.service.js';
import { RoleUtilisateur } from '../generated/prisma/enums.js';
import { MailerService } from './mailer.service.js';
import { ResetPassword } from './dto/reset-password.dto.js';

interface SafeUser {
  idUtilisateur: number;
  nom: string;
  email: string | null;
  telephone: string | null;
  estActif: boolean;
  creeLe: Date;
  misAJourLe: Date;
  roleUtilisateur: RoleUtilisateur;
}

@Injectable()
export class AuthService {
  // Doit rester cohérent avec JWT_REFRESH_EXPIRES_IN et le maxAge du cookie
  private static readonly DUREE_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly utilisateurService: UtilisateursService,
    @Inject('REFRESH_JWT_SERVICE')
    private readonly refreshJwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly utilisateurSession: UtilisateursSessionsService,
    private readonly mailerService: MailerService,
  ) {}

  async inscrire(registerDto: RegisterDto) {
    const registeredUser = await this.utilisateurService.create(registerDto);

    return {
      success: true,
      message: 'Compte créé avec succès.',
      user: registeredUser
    }
  }

  async validerUtilisateur(dto: ConnexionDto) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { email: dto.identifiant },
      include: {
        identites: {
          where: {
            fournisseur: 'MOT_DE_PASSE'
          },
        },
      },
    });

    if (!utilisateur || !utilisateur.estActif) {
      return null;
    }

    const [passwordIdentity] = utilisateur.identites

    // `?.` : un utilisateur sans identité mot de passe ne doit pas faire planter la requête
    if (!passwordIdentity?.hashMotDePasse) {
      return null;
    }

    const passwordValid = await bcrypt.compare(
      dto.motDePasse,
      passwordIdentity.hashMotDePasse,
    );

    if (!passwordValid) {
      return null;
    }

    const { identites, ...userWithoutIdentities } = utilisateur;

    return userWithoutIdentities;
  }

  // jti : identifiant unique, pour que deux refresh tokens émis dans la même seconde
  // pour le même utilisateur ne soient jamais identiques (donc jamais le même hash)
  private async generateToken(id: number, email: string | null) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: id, email }),
      this.refreshJwtService.signAsync({ sub: id, email, jti: randomUUID() }),
    ]);

    return { accessToken, refreshToken }
  }

  private createHashToken(refreshToken: string) {
    return createHash('sha256').update(refreshToken).digest('hex')
  }

  /** Génère les tokens puis enregistre la session avec ton UtilisateursSessionsService */
  private async creerSession(idUtilisateur: number, email: string | null) {
    const { accessToken, refreshToken } = await this.generateToken(idUtilisateur, email)

    await this.utilisateurSession.create(
      idUtilisateur,
      this.createHashToken(refreshToken),
      new Date(Date.now() + AuthService.DUREE_SESSION_MS),
    )

    return { accessToken, refreshToken }
  }

  async connexion(utilisateur: SafeUser) {
    const { accessToken, refreshToken } = await this.creerSession(
      utilisateur.idUtilisateur,
      utilisateur.email,
    );

    return {
      success: true,
      message: 'Connexion réussie.',
      accessToken,
      refreshToken,
      user: {
        id: utilisateur.idUtilisateur,
        nom: utilisateur.nom,
        email: utilisateur.email,
        telephone: utilisateur.telephone,
        estActif: utilisateur.estActif,
        roleUtilisateur: utilisateur.roleUtilisateur
      },
    };
  }

  async refresh(rt: string) {
    if (!rt) {
      throw new UnauthorizedException('Refresh token manquant.');
    }

    // 1 - vérifier la signature et l'expiration du refresh token
    let payload: { sub: number; email: string | null };

    try {
      payload = await this.refreshJwtService.verifyAsync(rt);
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré.');
    }

    // 2 - le token identifie bien un utilisateur
    if (!payload.sub) {
      throw new UnauthorizedException('Refresh token invalide.');
    }

    // 3 - retrouver la session grâce au hash du refresh token
    const session = await this.prisma.sessionUtilisateur.findFirst({
      where: { hashJetonRafraichissement: this.createHashToken(rt) },
      include: { utilisateur: true },
    });

    if (!session) {
      throw new UnauthorizedException('Session introuvable.');
    }

    // 4 - la session appartient bien à l'utilisateur du token
    if (session.idUtilisateur !== payload.sub) {
      throw new UnauthorizedException('Session invalide.');
    }

    // 5 - la session n'a pas été révoquée
    if (session.revoqueLe) {
      throw new UnauthorizedException('Session révoquée.');
    }

    // 6 - la session n'a pas expiré en base
    if (session.expireLe <= new Date()) {
      throw new UnauthorizedException('Session expirée.');
    }

    // 7 - l'utilisateur est toujours actif
    if (!session.utilisateur.estActif) {
      throw new UnauthorizedException('Utilisateur désactivé.');
    }

    // 8 - révoquer l'ancienne session
    await this.utilisateurSession.update(session.idSession, new Date());

    // 9 - créer les nouveaux tokens et la nouvelle session
    const { accessToken, refreshToken } = await this.creerSession(
      session.utilisateur.idUtilisateur,
      session.utilisateur.email,
    );

    return {
      success: true,
      message: 'Token renouvelé avec succès.',
      accessToken,
      refreshToken,
      // "user" comme dans connexion() : c'est ce que lit le front après un refresh
      user: {
        id: session.utilisateur.idUtilisateur,
        nom: session.utilisateur.nom,
        email: session.utilisateur.email,
        telephone: session.utilisateur.telephone,
        estActif: session.utilisateur.estActif,
        roleUtilisateur: session.utilisateur.roleUtilisateur,
      },
    };
  }

    async forgotPassword ({ email, clientType }: { email: string; clientType?: 'mobile' | 'desktop' }) {
    // vérifier l'identité de l'utilisateur
    const identity = await this.prisma.identiteAuth.findFirst({
        where: {
            fournisseur: 'MOT_DE_PASSE',
            utilisateur: {
                email,
                estActif: true,
            },
        },
        include: {
            utilisateur: true,
        },
    });

    // Ne jamais divulguer si l'email existe ou non
    if (!identity) {
        return {
            success: true,
            message: "L'email de réinitialisation a été envoyé si le compte existe."
        }
    }

    const isMobile = clientType === 'mobile';

    //let resetTokenToSave: string;
    let hashedToken: string;
    let otpCodeToSend: string | undefined = undefined;
    let resetLinkToSend: string | undefined = undefined;

    if (isMobile) {
        // Générer un code à 6 chiffres
        const otpCode = randomInt(100000, 999900).toString();
        otpCodeToSend = otpCode;

        hashedToken = createHash('sha256').update(otpCode).digest('hex');
    } else {
        const resetToken = randomBytes(32).toString('hex');
        hashedToken = createHash('sha256').update(resetToken).digest('hex');

        const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
        resetLinkToSend = `${frontendUrl}/reset-password?token=${resetToken}`;
    }

    // Gérer l'expiration (15 minutes)
    const tokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Stocker dans la base
    await this.prisma.identiteAuth.update({
        where: { idIdentite: identity.idIdentite },
        data: {
            jetonReinitialisationMotDePasse: hashedToken,
            expirationReinitialisationMotDePasse: tokenExpiresAt,
        }
    });

    console.log(`Préparation à l'envoi de l'e-mail (${isMobile ? 'Mobile - OTP' : 'Desktop - Lien'})...`);

    // Envoi de l'email via ton MailerService mis à jour
    try {
        await this.mailerService.sendResetPasswordEmail(identity.utilisateur.email!, {
            resetLink: resetLinkToSend,
            otpCode: otpCodeToSend,
        });
    } catch (err) {
        // Nettoyer la base de données en cas d'échec
        await this.prisma.identiteAuth.update({
            where: { idIdentite: identity.idIdentite },
            data: {
                expirationReinitialisationMotDePasse: null,
                jetonReinitialisationMotDePasse: null,
            }
        });
        throw new Error(`Échec de l'envoi de l'e-mail`);
    }

    return {
        success: true,
        message: "L'instruction de réinitialisation a été envoyée."
    };
  }

  async resetPassword ({ token, password }: ResetPassword) {
    //re-hacher le token recu pour pouvoir le comparer avec celui dans la base
    const hashedToken = createHash('sha256').update(token).digest('hex');

    //trouver l'identite de ce token
    const identity = await this.prisma.identiteAuth.findFirst({
      where: {
        fournisseur:'MOT_DE_PASSE',
        jetonReinitialisationMotDePasse: hashedToken,
        expirationReinitialisationMotDePasse: {
          gt: new Date(),
        },
      },
    });

    if (!identity) {
      throw new UnauthorizedException(`Le jeton de réinitialisation est invalide ou a expiré.`)
    }

    //hacher le nouveau mot de passe
    console.log('hachage du mot de passe')
    const newPasswordHash = await bcrypt.hash(password, 10)

    await this.prisma.$transaction([
      this.prisma.identiteAuth.update({
        where: { idIdentite: identity.idIdentite },
        data: {
          hashMotDePasse: newPasswordHash,
          expirationReinitialisationMotDePasse: null,
          jetonReinitialisationMotDePasse: null,
        },
      }),

      this.prisma.sessionUtilisateur.updateMany({
        where: { 
          idUtilisateur: identity.idUtilisateur, 
          revoqueLe: null
        },
        data: { revoqueLe: new Date() }
      }),
    ]);

    console.log('mot de passe mis a jour')

    return {
      success: true,
      message: 'Votre mot de passe a été modifié avec succès. Veuillez vous reconnecter.',
    }
  }

}