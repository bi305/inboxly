import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async register(input: {
    email: string
    password: string
    name?: string
    workspaceName?: string
  }) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } })
    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const passwordHash = await bcrypt.hash(input.password, 12)
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name
      }
    })

    const workspace = await this.prisma.workspace.create({
      data: {
        name: input.workspaceName || 'My Workspace',
        members: {
          create: {
            userId: user.id,
            role: 'OWNER'
          }
        }
      }
    })

    const tokens = await this.issueTokens(user.id, user.email)

    return { user, workspace, tokens }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return null
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return null
    return user
  }

  async login(email: string, password: string, meta?: { userAgent?: string; ip?: string }) {
    const user = await this.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const tokens = await this.issueTokens(user.id, user.email, meta)
    return { user, tokens }
  }

  async loginWithOAuth(input: { email: string; name?: string }) {
    if (!input.email) {
      throw new UnauthorizedException('Email not available from provider')
    }
    let user = await this.prisma.user.findUnique({ where: { email: input.email } })
    if (!user) {
      const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12)
      user = await this.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash
        }
      })
      await this.prisma.workspace.create({
        data: {
          name: `${input.name || 'New'} Workspace`,
          members: { create: { userId: user.id, role: 'OWNER' } }
        }
      })
    }
    const tokens = await this.issueTokens(user.id, user.email)
    return { user, tokens }
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken)
    const stored = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    })
    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    })

    const tokens = await this.issueTokens(stored.user.id, stored.user.email)
    return { user: stored.user, tokens }
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken)
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() }
    })
    return { success: true }
  }

  private async issueTokens(userId: string, email: string, meta?: { userAgent?: string; ip?: string }) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, email },
      { expiresIn: this.config.get('jwt.accessTokenTtl') }
    )

    const refreshToken = this.generateRefreshToken()
    const refreshExpires = this.computeExpiry(this.config.get('jwt.refreshTokenTtl'))

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: refreshExpires,
        userAgent: meta?.userAgent,
        ip: meta?.ip
      }
    })

    return { accessToken, refreshToken, expiresAt: refreshExpires }
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(48).toString('base64url')
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  private computeExpiry(ttl: string | undefined): Date {
    const now = Date.now()
    const fallbackMs = 1000 * 60 * 60 * 24 * 30
    if (!ttl) return new Date(now + fallbackMs)
    const match = ttl.match(/^(\d+)([smhd])$/)
    if (!match) return new Date(now + fallbackMs)
    const value = Number(match[1])
    const unit = match[2]
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 1000 * 60,
      h: 1000 * 60 * 60,
      d: 1000 * 60 * 60 * 24
    }
    return new Date(now + value * multipliers[unit])
  }
}
