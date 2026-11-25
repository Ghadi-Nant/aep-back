import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  idUtilisateur: number;      // adapte (ex. sub)
  roleUtilisateur: string;    // adapte
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as JwtUser;
    return data ? user?.[data] : user;
  },
);