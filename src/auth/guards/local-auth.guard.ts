import { ExecutionContext, Inject, Injectable, Optional } from '@nestjs/common';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    @Optional() @Inject(AuthModuleOptions) options?: AuthModuleOptions,
  ) {
    super(options);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return (await super.canActivate(context)) as boolean;
  }
}