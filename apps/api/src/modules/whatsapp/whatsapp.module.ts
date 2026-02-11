import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { WhatsAppService } from './whatsapp.service'
import { WhatsAppController } from './whatsapp.controller'
import { WhatsAppQueueService } from '../../queues/whatsapp.queue'
import { WhatsAppProcessor } from '../../queues/whatsapp.processor'
import { CryptoService } from '../../common/crypto/crypto.service'
import { TemplatesModule } from './templates.module'

@Module({
  imports: [BullModule.registerQueue({ name: 'whatsapp-outbound' }), TemplatesModule],
  providers: [WhatsAppService, WhatsAppQueueService, WhatsAppProcessor, CryptoService],
  controllers: [WhatsAppController],
  exports: [WhatsAppService]
})
export class WhatsAppModule {}
