import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'
import { TemplatesService } from './templates.service'

@Controller('templates')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Get()
  async list(@Req() req: any) {
    return this.templates.list(req.workspaceId)
  }

  @Post()
  async create(@Req() req: any, @Body() body: { name: string; language: string }) {
    return this.templates.create(req.workspaceId, body)
  }
}
