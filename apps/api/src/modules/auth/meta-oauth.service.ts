import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import crypto from 'crypto'
import axios from 'axios'
import { BotsService } from '../bots/bots.service'
import { WhatsAppService } from '../whatsapp/whatsapp.service'

interface MetaStatePayload {
  workspaceId: string
  ts: number
}

@Injectable()
export class MetaOAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly bots: BotsService,
    private readonly whatsapp: WhatsAppService
  ) {}

  buildAuthUrl(workspaceId: string) {
    const appId = this.config.get<string>('meta.appId')
    const redirectUri = this.config.get<string>('meta.redirectUri')
    const scopes = this.config.get<string>('meta.scopes')
    const stateSecret = this.config.get<string>('meta.stateSecret')

    if (!appId || !redirectUri || !stateSecret) {
      throw new BadRequestException('Meta OAuth not configured')
    }

    const payload: MetaStatePayload = { workspaceId, ts: Date.now() }
    const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signature = crypto.createHmac('sha256', stateSecret).update(encoded).digest('base64url')
    const state = `${encoded}.${signature}`

    const url = new URL('https://www.facebook.com/v19.0/dialog/oauth')
    url.searchParams.set('client_id', appId)
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('state', state)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', scopes || '')

    return url.toString()
  }

  async handleCallback(code: string, state: string) {
    const { workspaceId } = this.verifyState(state)

    const appId = this.config.get<string>('meta.appId')
    const appSecret = this.config.get<string>('meta.appSecret')
    const redirectUri = this.config.get<string>('meta.redirectUri')
    const apiBase = this.config.get<string>('whatsapp.apiBaseUrl')

    if (!appId || !appSecret || !redirectUri) {
      throw new BadRequestException('Meta OAuth not configured')
    }

    const tokenRes = await axios.get(`${apiBase}/oauth/access_token`, {
      params: {
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code
      }
    })

    const accessToken = tokenRes.data?.access_token
    if (!accessToken) {
      throw new BadRequestException('Failed to obtain access token')
    }

    const wabaRes = await axios.get(`${apiBase}/me/whatsapp_business_accounts`, {
      params: { access_token: accessToken, fields: 'id,name' }
    })
    const waba = wabaRes.data?.data?.[0]
    if (!waba?.id) {
      throw new BadRequestException('No WhatsApp Business Account found')
    }

    const phoneRes = await axios.get(`${apiBase}/${waba.id}/phone_numbers`, {
      params: { access_token: accessToken, fields: 'id,display_phone_number' }
    })
    const phone = phoneRes.data?.data?.[0]
    if (!phone?.id) {
      throw new BadRequestException('No phone numbers found')
    }

    const bot = await this.bots.create(workspaceId, `Bot ${phone.display_phone_number || ''}`.trim())

    await this.whatsapp.createConnection(workspaceId, {
      phoneNumberId: phone.id,
      businessId: waba.id,
      accessToken,
      botId: bot.id
    })

    return this.config.get<string>('meta.successRedirect') || 'http://localhost:3000/whatsapp'
  }

  private verifyState(state: string): MetaStatePayload {
    const [encoded, signature] = state.split('.')
    const secret = this.config.get<string>('meta.stateSecret')
    if (!encoded || !signature || !secret) {
      throw new BadRequestException('Invalid state')
    }
    const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url')
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      throw new BadRequestException('Invalid state signature')
    }
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as MetaStatePayload
    if (!payload.workspaceId || !payload.ts) {
      throw new BadRequestException('Invalid state payload')
    }
    if (Date.now() - payload.ts > 15 * 60 * 1000) {
      throw new BadRequestException('State expired')
    }
    return payload
  }
}
