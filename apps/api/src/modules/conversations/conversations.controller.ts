import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'
import { ConversationsService } from './conversations.service'

@Controller('conversations')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class ConversationsController {
  constructor(private readonly conversations: ConversationsService) {}

  @Get()
  async list(@Req() req: any) {
    return this.conversations.listConversations(req.workspaceId)
  }

  @Get(':id/messages')
  async messages(@Req() req: any, @Param('id') id: string) {
    return this.conversations.getConversationMessages(req.workspaceId, id)
  }
}
