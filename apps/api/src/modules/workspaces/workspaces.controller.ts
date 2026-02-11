import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { Roles } from '../../common/decorators/roles.decorator'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { AddMemberDto } from './dto/add-member.dto'
import { WorkspacesService } from './workspaces.service'

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspaces: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@CurrentUser() user: any) {
    return this.workspaces.listForUser(user.sub)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateWorkspaceDto) {
    return this.workspaces.create(user.sub, dto.name)
  }

  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Get('members')
  async members(@Req() req: any) {
    return this.workspaces.listMembers(req.workspaceId)
  }

  @UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Post('members')
  async addMember(@Req() req: any, @Body() dto: AddMemberDto) {
    return this.workspaces.addMember(req.workspaceId, req.workspaceRole, dto)
  }
}
