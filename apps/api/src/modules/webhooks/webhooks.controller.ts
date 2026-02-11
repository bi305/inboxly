import { Controller, Get, Post, Query, Req, Res, Body } from '@nestjs/common'
import { Response } from 'express'
import { WhatsAppService } from '../whatsapp/whatsapp.service'
import { WebhooksService } from './webhooks.service'
import { ConfigService } from '@nestjs/config'

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly whatsapp: WhatsAppService,
    private readonly webhooks: WebhooksService,
    private readonly config: ConfigService
  ) {}

  @Get('whatsapp')
  async verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response
  ) {
    if (mode !== 'subscribe' || !token) {
      return res.status(400).send('Invalid mode')
    }
    const expected = this.config.get<string>('meta.webhookVerifyToken')
    if (!expected || token !== expected) {
      return res.status(403).send('Forbidden')
    }
    return res.status(200).send(challenge)
  }

  @Post('whatsapp')
  async receive(@Body() body: any, @Req() req: any) {
    void this.webhooks.handleWhatsAppWebhook(body)
    return { ok: true }
  }
}
