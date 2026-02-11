import { Module } from '@nestjs/common'
import { RuntimeService } from './runtime.service'
import { RuntimeController } from './runtime.controller'
import { BotsModule } from '../bots/bots.module'
import { ConversationsModule } from '../conversations/conversations.module'
import { WhatsAppModule } from '../whatsapp/whatsapp.module'

@Module({
  imports: [BotsModule, ConversationsModule, WhatsAppModule],
  providers: [RuntimeService],
  controllers: [RuntimeController],
  exports: [RuntimeService]
})
export class RuntimeModule {}
