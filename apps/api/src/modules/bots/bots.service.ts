import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { FlowDefinitionSchema } from '@shared'
import { Prisma } from '@prisma/client'

@Injectable()
export class BotsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(workspaceId: string) {
    return this.prisma.bot.findMany({ where: { workspaceId } })
  }

  async create(workspaceId: string, name: string) {
    return this.prisma.bot.create({
      data: { workspaceId, name }
    })
  }

  async createDraftVersion(workspaceId: string, botId: string, flow: Record<string, unknown>) {
    await this.ensureBotWorkspace(botId, workspaceId)
    const parsed = FlowDefinitionSchema.safeParse(flow)
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten())
    }
    const latest = await this.prisma.botVersion.findFirst({
      where: { botId },
      orderBy: { version: 'desc' }
    })
    const nextVersion = (latest?.version || 0) + 1
    const flowJson = parsed.data as Prisma.InputJsonValue
    return this.prisma.botVersion.create({
      data: {
        botId,
        version: nextVersion,
        status: 'DRAFT',
        flow: flowJson
      }
    })
  }

  async publishVersion(workspaceId: string, botId: string, versionId: string) {
    await this.ensureBotWorkspace(botId, workspaceId)
    const version = await this.prisma.botVersion.findUnique({ where: { id: versionId } })
    if (!version || version.botId !== botId) {
      throw new NotFoundException('Version not found')
    }
    await this.prisma.botVersion.updateMany({
      where: { botId, status: 'PUBLISHED' },
      data: { status: 'DRAFT' }
    })
    return this.prisma.botVersion.update({
      where: { id: versionId },
      data: { status: 'PUBLISHED' }
    })
  }

  async getPublishedVersion(botId: string) {
    return this.prisma.botVersion.findFirst({
      where: { botId, status: 'PUBLISHED' },
      orderBy: { version: 'desc' }
    })
  }

  private async ensureBotWorkspace(botId: string, workspaceId: string) {
    const bot = await this.prisma.bot.findUnique({ where: { id: botId } })
    if (!bot || bot.workspaceId !== workspaceId) {
      throw new NotFoundException('Bot not found')
    }
  }
}
