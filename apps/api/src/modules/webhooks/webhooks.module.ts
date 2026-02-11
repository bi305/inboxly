import { Module } from '@nestjs/common'
import { WebhooksService } from './webhooks.service'
import { WebhooksController } from './webhooks.controller'
import { WhatsAppModule } from '../whatsapp/whatsapp.module'
import { RuntimeModule } from '../runtime/runtime.module'

@Module({
  imports: [WhatsAppModule, RuntimeModule],
  providers: [WebhooksService],
  controllers: [WebhooksController]
})
export class WebhooksModule {}
