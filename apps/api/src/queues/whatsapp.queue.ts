import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class WhatsAppQueueService {
  constructor(
    @InjectQueue('whatsapp-outbound') private readonly queue: Queue,
    private readonly prisma: PrismaService
  ) {}

  async enqueue(input: {
    workspaceId: string
    connectionId: string
    payload: Record<string, any>
    idempotencyKey: string
    delayMs?: number
  }) {
    try {
      await this.prisma.idempotencyKey.create({
        data: {
          workspaceId: input.workspaceId,
          key: input.idempotencyKey,
          status: 'PENDING'
        }
      })
    } catch (err) {
      return
    }

    await this.queue.add(
      'send-message',
      {
        workspaceId: input.workspaceId,
        connectionId: input.connectionId,
        payload: input.payload,
        idempotencyKey: input.idempotencyKey
      },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        delay: input.delayMs || 0,
        removeOnComplete: 1000,
        removeOnFail: 1000
      }
    )
  }
}
