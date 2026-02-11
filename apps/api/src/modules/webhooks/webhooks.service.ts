import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { WhatsAppService } from '../whatsapp/whatsapp.service'
import { RuntimeService } from '../runtime/runtime.service'

@Injectable()
export class WebhooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsAppService,
    private readonly runtime: RuntimeService
  ) {}

  async handleWhatsAppWebhook(payload: any) {
    const entries = payload.entry || []

    for (const entry of entries) {
      const changes = entry.changes || []
      for (const change of changes) {
        const value = change.value
        const phoneNumberId = value?.metadata?.phone_number_id
        if (!phoneNumberId) continue

        const connection = await this.whatsapp.findConnectionByPhoneNumberId(phoneNumberId)
        if (!connection || !connection.botId) continue

        const messages = value.messages || []
        for (const message of messages) {
          const eventId = message.id || `${message.timestamp || Date.now()}:${message.from}`
          const exists = await this.prisma.webhookEvent.findUnique({
            where: { connectionId_eventId: { connectionId: connection.id, eventId } }
          })
          if (exists) continue

          await this.prisma.webhookEvent.create({
            data: {
              workspaceId: connection.workspaceId,
              connectionId: connection.id,
              eventId,
              payload: message
            }
          })

          let interactive:
            | { type: 'button' | 'list'; id: string; title?: string }
            | undefined
          if (message.interactive?.type === 'button_reply') {
            interactive = {
              type: 'button',
              id: String(message.interactive.button_reply?.id || ''),
              title: message.interactive.button_reply?.title
            }
          } else if (message.interactive?.type === 'list_reply') {
            interactive = {
              type: 'list',
              id: String(message.interactive.list_reply?.id || ''),
              title: message.interactive.list_reply?.title
            }
          }

          await this.runtime.processIncomingMessage({
            workspaceId: connection.workspaceId,
            connectionId: connection.id,
            botId: connection.botId,
            from: message.from,
            messageId: eventId,
            text: message.text?.body,
            interactive
          })
        }
      }
    }

    return { ok: true }
  }
}
