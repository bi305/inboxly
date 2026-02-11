import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'
import { BotsService } from './bots.service'
import { CreateBotDto } from './dto/create-bot.dto'
import { CreateVersionDto } from './dto/create-version.dto'

@Controller('bots')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class BotsController {
  constructor(private readonly bots: BotsService) {}

  @Get()
  async list(@Req() req: any) {
    return this.bots.list(req.workspaceId)
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateBotDto) {
    return this.bots.create(req.workspaceId, dto.name)
  }

  @Post(':botId/versions')
  async createVersion(@Req() req: any, @Param('botId') botId: string, @Body() dto: CreateVersionDto) {
    return this.bots.createDraftVersion(req.workspaceId, botId, dto.flow)
  }

  @Post(':botId/versions/:versionId/publish')
  async publish(@Req() req: any, @Param('botId') botId: string, @Param('versionId') versionId: string) {
    return this.bots.publishVersion(req.workspaceId, botId, versionId)
  }

  @Get(':botId/versions/published')
  async getPublished(@Param('botId') botId: string) {
    return this.bots.getPublishedVersion(botId)
  }
}
