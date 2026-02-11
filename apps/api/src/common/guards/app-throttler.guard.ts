import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const workspaceId = req.workspaceId || req.headers['x-workspace-id'] || 'public'
    const phone =
      req.body?.entry?.[0]?.changes?.[0]?.value?.metadata?.phone_number_id ||
      req.body?.phone_number_id
    return `${workspaceId}:${phone || req.ip}`
  }
}
