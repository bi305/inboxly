import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const workspaceId = (request.headers['x-workspace-id'] as string) || request.params.workspaceId
    if (!workspaceId) {
      throw new ForbiddenException('Workspace scope required')
    }
    const user = request.user
    if (!user?.sub) {
      throw new ForbiddenException('Unauthorized')
    }
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.sub
        }
      }
    })
    if (!member) {
      throw new ForbiddenException('Not a workspace member')
    }
    request.workspaceId = workspaceId
    request.workspaceRole = member.role
    return true
  }
}
