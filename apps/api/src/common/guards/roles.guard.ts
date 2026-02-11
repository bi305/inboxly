import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles || roles.length === 0) return true

    const request = context.switchToHttp().getRequest()
    const role = request.workspaceRole
    if (!role || !roles.includes(role)) {
      throw new ForbiddenException('Insufficient role')
    }
    return true
  }
}
