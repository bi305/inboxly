import { Body, Controller, Post, Req, Get, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { RefreshDto } from './dto/refresh.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: any) {
    return this.auth.login(dto.email, dto.password, {
      userAgent: req.headers['user-agent'],
      ip: req.ip
    })
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken)
  }

  @Post('logout')
  async logout(@Body() dto: RefreshDto) {
    return this.auth.logout(dto.refreshToken)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return { ok: true }
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any) {
    const profile = req.user
    return this.auth.loginWithOAuth({ email: profile.email, name: profile.name })
  }
}
