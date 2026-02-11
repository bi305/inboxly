import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'
import { GoogleStrategy } from './google.strategy'
import { MetaOAuthController } from './meta-oauth.controller'
import { MetaOAuthService } from './meta-oauth.service'
import { BotsModule } from '../bots/bots.module'
import { WhatsAppModule } from '../whatsapp/whatsapp.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    BotsModule,
    WhatsAppModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret')
      })
    })
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, MetaOAuthService],
  controllers: [AuthController, MetaOAuthController],
  exports: [AuthService]
})
export class AuthModule {}
