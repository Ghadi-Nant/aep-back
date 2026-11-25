import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequis = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Aucun @Roles : tout utilisateur connecté passe
    if (!rolesRequis || rolesRequis.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user?.role || !rolesRequis.includes(user.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits nécessaires pour cette action.",
      );
    }

    return true;
  }
}