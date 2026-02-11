import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    const existing = req.headers['x-request-id'] as string | undefined
    const id = existing || uuidv4()
    req.correlationId = id
    req.id = id
    res.setHeader('x-request-id', id)
    return next.handle()
  }
}
