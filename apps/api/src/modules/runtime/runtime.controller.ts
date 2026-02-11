import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { WorkspaceGuard } from '../../common/guards/workspace.guard'
import { RuntimeService } from './runtime.service'

@Controller('runtime')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class RuntimeController {
  constructor(private readonly runtime: RuntimeService) {}

  @Post('simulate')
  async simulate(@Body() body: any) {
    return this.runtime.simulate(body.flow, { text: body.text || '' }, body.variables || {})
  }
}
