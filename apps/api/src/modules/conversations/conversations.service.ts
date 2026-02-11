import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateContact(workspaceId: string, phoneNumber: string, displayName?: string) {
    const existing = await this.prisma.contact.findUnique({
      where: { workspaceId_phoneNumber: { workspaceId, phoneNumber } }
    })
    if (existing) return existing
    return this.prisma.contact.create({
      data: { workspaceId, phoneNumber, displayName }
    })
  }

  async getOrCreateConversation(workspaceId: string, botId: string, contactId: string) {
    const existing = await this.prisma.conversation.findUnique({
      where: { workspaceId_contactId_botId: { workspaceId, contactId, botId } },
      include: { state: true }
    })
    if (existing) return existing

    return this.prisma.conversation.create({
      data: {
        workspaceId,
        botId,
        contactId,
        state: { create: { variables: {} } }
      },
      include: { state: true }
    })
  }

  async appendMessage(conversationId: string, input: {
    direction: 'INBOUND' | 'OUTBOUND'
    messageId?: string
    idempotencyKey?: string
    payload: Record<string, any>
  }) {
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        direction: input.direction,
        messageId: input.messageId,
        idempotencyKey: input.idempotencyKey,
        payload: input.payload
      }
    })
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastInteractionAt: new Date() }
    })
    return message
  }

  async updateState(conversationId: string, input: { currentNodeId?: string; variables: any }) {
    return this.prisma.conversationState.upsert({
      where: { conversationId },
      update: {
        currentNodeId: input.currentNodeId,
        variables: input.variables
      },
      create: {
        conversationId,
        currentNodeId: input.currentNodeId,
        variables: input.variables
      }
    })
  }

  async listConversations(workspaceId: string) {
    return this.prisma.conversation.findMany({
      where: { workspaceId },
      include: { contact: true, bot: true }
    })
  }

  async getConversationMessages(workspaceId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } })
    if (!conversation || conversation.workspaceId !== workspaceId) {
      return []
    }
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    })
  }
}
