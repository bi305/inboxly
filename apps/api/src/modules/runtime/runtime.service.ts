import { Injectable, NotFoundException } from '@nestjs/common'
import { RuntimeEngine } from './runtime.engine'
import { BotsService } from '../bots/bots.service'
import { ConversationsService } from '../conversations/conversations.service'
import { WhatsAppService } from '../whatsapp/whatsapp.service'
import axios from 'axios'
import { Prisma } from '@prisma/client'

@Injectable()
export class RuntimeService {
  private engine = new RuntimeEngine()

  constructor(
    private readonly bots: BotsService,
    private readonly conversations: ConversationsService,
    private readonly whatsapp: WhatsAppService
  ) {}

  async processIncomingMessage(input: {
    workspaceId: string
    botId: string
    connectionId: string
    from: string
    messageId: string
    text?: string
    interactive?: { type: 'button' | 'list'; id: string; title?: string }
  }) {
    const version = await this.bots.getPublishedVersion(input.botId)
    if (!version) {
      throw new NotFoundException('No published bot version')
    }

    const contact = await this.conversations.getOrCreateContact(
      input.workspaceId,
      input.from,
      input.interactive?.title
    )
    const conversation = await this.conversations.getOrCreateConversation(
      input.workspaceId,
      input.botId,
      contact.id
    )

    await this.conversations.appendMessage(conversation.id, {
      direction: 'INBOUND',
      messageId: input.messageId,
      payload: {
        text: input.text,
        interactive: input.interactive
      }
    })

    const variables = {
      ...((conversation.state?.variables as Prisma.JsonObject) || {})
    } as Record<string, any>
    const effectiveText = input.text || input.interactive?.id || input.interactive?.title || ''
    const result = this.engine.execute(version.flow as any, { text: effectiveText }, variables)

    let delayMs: number | undefined
    for (const action of result.actions) {
      const type = action.data.actionType
      if (type === 'set_variable') {
        const key = String(action.data.key || '')
        variables[key] = action.data.value
      }
      if (type === 'delay') {
        delayMs = Number(action.data.ms || 0)
      }
      if (type === 'call_webhook') {
        const url = String(action.data.url || '')
        const method = String(action.data.method || 'POST').toUpperCase()
        await axios({ url, method, data: { variables, contact, conversation }, timeout: 8000 })
      }
      if (type.startsWith('send_')) {
        const payload = this.buildOutboundPayload(type, action.data, input.from)
        const idempotencyKey = `${conversation.id}:${input.messageId}:${action.id}`
        await this.conversations.appendMessage(conversation.id, {
          direction: 'OUTBOUND',
          idempotencyKey,
          payload
        })
        await this.whatsapp.enqueueOutboundMessage({
          workspaceId: input.workspaceId,
          connectionId: input.connectionId,
          payload,
          idempotencyKey,
          delayMs
        })
        delayMs = undefined
      }
    }

    await this.conversations.updateState(conversation.id, {
      currentNodeId: result.actions[result.actions.length - 1]?.id,
      variables
    })

    return { ok: true }
  }

  async simulate(flow: any, input: { text: string }, variables: Record<string, any>) {
    const result = this.engine.execute(flow, { text: input.text }, variables)
    return result.actions
  }

  private buildOutboundPayload(actionType: string, data: Record<string, any>, to: string) {
    if (actionType === 'send_text') {
      return {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: String(data.text || '') }
      }
    }
    if (actionType === 'send_template') {
      return {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: String(data.name || ''),
          language: { code: String(data.language || 'en_US') },
          components: data.components || []
        }
      }
    }
    if (actionType === 'send_interactive') {
      return {
        messaging_product: 'whatsapp',
        to,
        type: 'interactive',
        interactive: data.interactive
      }
    }
    if (actionType === 'send_media') {
      return {
        messaging_product: 'whatsapp',
        to,
        type: data.media?.type || 'image',
        [data.media?.type || 'image']: {
          link: data.media?.link
        }
      }
    }

    return {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: 'Unsupported action' }
    }
  }
}
