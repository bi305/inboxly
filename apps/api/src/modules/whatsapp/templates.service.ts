import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(workspaceId: string) {
    return this.prisma.template.findMany({ where: { workspaceId } })
  }

  async create(workspaceId: string, input: { name: string; language: string }) {
    return this.prisma.template.upsert({
      where: { workspaceId_name_language: { workspaceId, name: input.name, language: input.language } },
      update: {},
      create: { workspaceId, name: input.name, language: input.language }
    })
  }
}
