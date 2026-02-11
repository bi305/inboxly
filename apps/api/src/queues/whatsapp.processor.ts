import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import axios from 'axios'
import { PrismaService } from '../prisma/prisma.service'
import { WhatsAppService } from '../modules/whatsapp/whatsapp.service'
import { ConfigService } from '@nestjs/config'

@Processor('whatsapp-outbound')
export class WhatsAppProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsapp: WhatsAppService,
    private readonly config: ConfigService
  ) {
    super()
  }

  async process(job: Job) {
    if (job.name !== 'send-message') {
      return
    }
    const { workspaceId, connectionId, payload, idempotencyKey } = job.data
    const connection = await this.prisma.whatsAppConnection.findUnique({ where: { id: connectionId } })
    if (!connection) return

    const accessToken = await this.whatsapp.getAccessToken(connectionId)
    const url = `${this.config.get('whatsapp.apiBaseUrl')}/${connection.phoneNumberId}/messages`

    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        timeout: 10000
      })

      await this.prisma.idempotencyKey.update({
        where: { workspaceId_key: { workspaceId, key: idempotencyKey } },
        data: { status: 'SENT' }
      })
    } catch (error) {
      await this.prisma.idempotencyKey.update({
        where: { workspaceId_key: { workspaceId, key: idempotencyKey } },
        data: { status: 'FAILED' }
      })
      throw error
    }
  }
}
