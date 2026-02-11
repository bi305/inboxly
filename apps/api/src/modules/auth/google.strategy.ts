import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly enabled: boolean

  constructor(config: ConfigService) {
    const clientID = config.get<string>('oauth.google.clientId')
    const clientSecret = config.get<string>('oauth.google.clientSecret')
    const callbackURL = config.get<string>('oauth.google.callbackUrl')
    const enabled = Boolean(clientID && clientSecret && callbackURL)

    super({
      clientID: clientID || 'disabled',
      clientSecret: clientSecret || 'disabled',
      callbackURL: callbackURL || 'http://localhost/disabled',
      scope: ['email', 'profile']
    })

    this.enabled = enabled
  }

  authenticate(req: any, options?: any) {
    if (!this.enabled) {
      return this.fail({ message: 'Google OAuth not configured' }, 400)
    }
    return super.authenticate(req, options)
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value
    const name = profile.displayName
    return { email, name, provider: 'google' }
  }
}
