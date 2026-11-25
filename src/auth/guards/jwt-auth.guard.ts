import { ExecutionContext, Inject, Injectable, Optional } from '@nestjs/common';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Optional() @Inject(AuthModuleOptions) options?: AuthModuleOptions,
  ) {
    super(options);
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}