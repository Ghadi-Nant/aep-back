import { Controller, Get, Post, Body, Res, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { ConnexionDto } from './dto/login.dto.js';
import type { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { ForgotPassword } from './dto/forgot.dto.js';
import { ResetPassword } from './dto/reset-password.dto.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.inscrire(registerDto);
  }
  @Get('me')
  me(@Request() req: any) {
    return req.user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req: any,
    @Body() _loginDto: ConnexionDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.connexion(req.user);

    console.log('tentative de login : ', req.user)

    res.cookie('refresh_token',
      result.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:
          process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      },
    );

    return result;
  }

  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Body() refreshDto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = refreshDto.refreshToken ?? req.cookies?.refresh_token;

    console.log('tente de rafraichir: ', refreshToken)

    const result = await this.authService.refresh(refreshToken);

    res.cookie('refresh_token', result.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:
          process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      },
    );

    return result;
  }

  @Post('forgot-password')
  ForgotPassword(@Body() forgotPasswordDto: ForgotPassword) {
    console.log("email et client recu :", forgotPasswordDto)
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post('reset-password')
  ResetPassword(@Body() resetPasswordDto: ResetPassword) {
    console.log("token et password recu : ", resetPasswordDto)
    return this.authService.resetPassword(resetPasswordDto)
  }
}
