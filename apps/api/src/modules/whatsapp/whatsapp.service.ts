import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CryptoService } from '../../common/crypto/crypto.service'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { WhatsAppQueueService } from '../../queues/whatsapp.queue'

@Injectable()
export class WhatsAppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly config: ConfigService,
    private readonly queue: WhatsAppQueueService
  ) {}

  async createConnection(workspaceId: string, input: {
    phoneNumberId: string
    businessId: string
    accessToken: string
    verifyToken?: string
    botId?: string
  }) {
    const verifyToken =
      input.verifyToken || this.config.get<string>('meta.webhookVerifyToken')
    if (!verifyToken) {
      throw new Error('META_WEBHOOK_VERIFY_TOKEN is required')
    }
    const enc = this.crypto.encrypt(input.accessToken)
    const verifyTokenHash = this.crypto.hashVerifyToken(verifyToken)

    const connection = await this.prisma.whatsAppConnection.create({
      data: {
        workspaceId,
        botId: input.botId,
        phoneNumberId: input.phoneNumberId,
        businessId: input.businessId,
        accessTokenEnc: enc.ciphertext,
        accessTokenIv: enc.iv,
        accessTokenTag: enc.tag,
        verifyTokenHash,
        status: 'ACTIVE'
      }
    })

    return this.sanitize(connection)
  }

  async listConnections(workspaceId: string) {
    const connections = await this.prisma.whatsAppConnection.findMany({ where: { workspaceId } })
    return connections.map((connection: any) => this.sanitize(connection))
  }

  async updateConnection(
    workspaceId: string,
    id: string,
    input: { accessToken?: string; verifyToken?: string; botId?: string }
  ) {
    const existing = await this.prisma.whatsAppConnection.findUnique({ where: { id } })
    if (!existing || existing.workspaceId !== workspaceId) {
      throw new NotFoundException('Connection not found')
    }
    const data: any = {}
    if (input.accessToken) {
      const enc = this.crypto.encrypt(input.accessToken)
      data.accessTokenEnc = enc.ciphertext
      data.accessTokenIv = enc.iv
      data.accessTokenTag = enc.tag
    }
    if (input.verifyToken) {
      data.verifyTokenHash = this.crypto.hashVerifyToken(input.verifyToken)
    }
    if (input.botId !== undefined) {
      data.botId = input.botId
    }
    const updated = await this.prisma.whatsAppConnection.update({
      where: { id },
      data
    })
    return this.sanitize(updated)
  }

  async testConnection(workspaceId: string, id: string) {
    const connection = await this.prisma.whatsAppConnection.findUnique({ where: { id } })
    if (!connection || connection.workspaceId !== workspaceId) {
      throw new NotFoundException('Connection not found')
    }
    const accessToken = this.crypto.decrypt(
      connection.accessTokenEnc,
      connection.accessTokenIv,
      connection.accessTokenTag
    )
    const url = `${this.config.get('whatsapp.apiBaseUrl')}/${connection.phoneNumberId}`
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { fields: 'display_phone_number,verified_name' },
      timeout: 8000
    })
    return { ok: true, data: response.data }
  }

  async findConnectionByVerifyToken(verifyToken: string) {
    const hash = this.crypto.hashVerifyToken(verifyToken)
    return this.prisma.whatsAppConnection.findFirst({ where: { verifyTokenHash: hash } })
  }

  async findConnectionByPhoneNumberId(phoneNumberId: string) {
    return this.prisma.whatsAppConnection.findFirst({ where: { phoneNumberId } })
  }

  async enqueueOutboundMessage(input: {
    workspaceId: string
    connectionId: string
    payload: Record<string, any>
    idempotencyKey: string
    delayMs?: number
  }) {
    await this.queue.enqueue(input)
  }

  async getAccessToken(connectionId: string) {
    const connection = await this.prisma.whatsAppConnection.findUnique({ where: { id: connectionId } })
    if (!connection) {
      throw new NotFoundException('Connection not found')
    }
    return this.crypto.decrypt(connection.accessTokenEnc, connection.accessTokenIv, connection.accessTokenTag)
  }

  private sanitize(connection: any) {
    const { accessTokenEnc, accessTokenIv, accessTokenTag, verifyTokenHash, ...rest } = connection
    return rest
  }
}
