import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CorrelationIdInterceptor } from './common/interceptors/correlation-id.interceptor'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger } from 'nestjs-pino'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const config = app.get(ConfigService)
  app.useLogger(app.get(Logger))

  app.use(helmet())
  app.enableCors({
    origin: config.get('cors.origin'),
    credentials: true
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new CorrelationIdInterceptor())

  app.setGlobalPrefix('api')

  if (config.get('env') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('WhatsApp Bot Builder API')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document)
  }

  await app.listen(config.get<number>('port') ?? 4000)
}

bootstrap()
