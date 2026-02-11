import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: { members: true }
    })
  }

  async create(userId: string, name: string) {
    return this.prisma.workspace.create({
      data: {
        name,
        members: {
          create: { userId, role: 'OWNER' }
        }
      }
    })
  }

  async addMember(
    workspaceId: string,
    requesterRole: string,
    input: { email: string; role: 'OWNER' | 'ADMIN' | 'MEMBER' }
  ) {
    if (!['OWNER', 'ADMIN'].includes(requesterRole)) {
      throw new ForbiddenException('Insufficient role')
    }
    const user = await this.prisma.user.findUnique({ where: { email: input.email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: { workspaceId, userId: user.id }
      },
      update: { role: input.role },
      create: {
        workspaceId,
        userId: user.id,
        role: input.role
      }
    })
  }

  async listMembers(workspaceId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: { user: true }
    })
  }
}
