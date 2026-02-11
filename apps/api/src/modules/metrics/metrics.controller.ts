import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'

@Controller('metrics')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class MetricsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async metrics(@Req() req: any) {
    const workspaceId = req.workspaceId
    const [bots, conversations] = await Promise.all([
      this.prisma.bot.count({ where: { workspaceId } }),
      this.prisma.conversation.count({ where: { workspaceId } })
    ])
    return {
      workspaceId,
      bots,
      conversations
    }
  }
}
