import { Controller, Get, Post, Query, Res, UseGuards, Req } from '@nestjs/common'
import { Response } from 'express'
import { MetaOAuthService } from './meta-oauth.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'

@Controller('auth/meta')
export class MetaOAuthController {
  constructor(private readonly meta: MetaOAuthService) {}

  @Post('start')
  @UseGuards(JwtAuthGuard, WorkspaceGuard)
  async start(@Req() req: any) {
    const url = this.meta.buildAuthUrl(req.workspaceId)
    return { url }
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    const redirectUrl = await this.meta.handleCallback(code, state)
    return res.redirect(redirectUrl)
  }
}
