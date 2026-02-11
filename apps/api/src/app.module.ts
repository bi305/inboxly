import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './config/configuration'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { WorkspacesModule } from './modules/workspaces/workspaces.module'
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module'
import { BotsModule } from './modules/bots/bots.module'
import { RuntimeModule } from './modules/runtime/runtime.module'
import { ConversationsModule } from './modules/conversations/conversations.module'
import { WebhooksModule } from './modules/webhooks/webhooks.module'
import { HealthModule } from './modules/health/health.module'
import { MetricsModule } from './modules/metrics/metrics.module'
import { BillingModule } from './modules/billing/billing.module'
import { BullModule } from '@nestjs/bullmq'
import { ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AppThrottlerGuard } from './common/guards/app-throttler.guard'
import { LoggerModule } from 'nestjs-pino'
import { v4 as uuidv4 } from 'uuid'
import { RedisThrottlerStorageService } from './common/guards/redis-throttler-storage.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        genReqId: (req) => req.headers['x-request-id'] || uuidv4(),
        redact: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.accessToken',
          'req.body.verifyToken',
          'req.body.refreshToken'
        ],
        transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined
      }
    }),
    PrismaModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 60,
            limit: 200
          }
        ],
        storage: new RedisThrottlerStorageService(
          config.get<string>('redis.url') ?? 'redis://localhost:6379'
        )
      })
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get('redis.url')
        }
      })
    }),
    AuthModule,
    WorkspacesModule,
    WhatsAppModule,
    BotsModule,
    RuntimeModule,
    ConversationsModule,
    WebhooksModule,
    HealthModule,
    MetricsModule,
    BillingModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard
    }
  ]
})
export class AppModule {}
