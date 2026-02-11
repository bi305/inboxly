import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { WhatsAppService } from './whatsapp.service'
import { CreateConnectionDto } from './dto/create-connection.dto'
import { UpdateConnectionDto } from './dto/update-connection.dto'

@Controller('whatsapp')
@UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
export class WhatsAppController {
  constructor(private readonly whatsapp: WhatsAppService) {}

  @Get('connections')
  async list(@Req() req: any) {
    return this.whatsapp.listConnections(req.workspaceId)
  }

  @Roles('OWNER', 'ADMIN')
  @Post('connections')
  async create(@Req() req: any, @Body() dto: CreateConnectionDto) {
    return this.whatsapp.createConnection(req.workspaceId, dto)
  }

  @Roles('OWNER', 'ADMIN')
  @Patch('connections/:id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateConnectionDto) {
    return this.whatsapp.updateConnection(req.workspaceId, id, dto)
  }

  @Roles('OWNER', 'ADMIN')
  @Post('connections/:id/test')
  async test(@Req() req: any, @Param('id') id: string) {
    return this.whatsapp.testConnection(req.workspaceId, id)
  }
}
