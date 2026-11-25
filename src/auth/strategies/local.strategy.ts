import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service.js';
import { ConnexionDto } from '../dto/login.dto.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'identifiant',
      passwordField: 'motDePasse'
    });
  }

  async validate(identifiant: string, motDePasse: string) {
    const user = await this.authService.validerUtilisateur({
      identifiant,
      motDePasse,
    });

    if (!user) {
      throw new UnauthorizedException(
        'Email ou mot de passe incorrect.',
      );
    }

    return user;
  }
}