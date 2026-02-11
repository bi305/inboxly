export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    accessTokenTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTokenTtl: process.env.JWT_REFRESH_TTL || '30d'
  },
  encryptionKey: process.env.APP_ENCRYPTION_KEY || '',
  verifyTokenSecret: process.env.VERIFY_TOKEN_SECRET || '',
  whatsapp: {
    apiBaseUrl: process.env.WHATSAPP_API_BASE_URL || 'https://graph.facebook.com/v19.0',
    appId: process.env.WHATSAPP_APP_ID || ''
  },
  meta: {
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    redirectUri: process.env.META_OAUTH_REDIRECT_URI || '',
    scopes:
      process.env.META_OAUTH_SCOPES ||
      'whatsapp_business_management,whatsapp_business_messaging,business_management',
    stateSecret: process.env.META_OAUTH_STATE_SECRET || '',
    successRedirect: process.env.META_OAUTH_SUCCESS_REDIRECT || 'http://localhost:3000/whatsapp',
    webhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || ''
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_OAUTH_CALLBACK_URL || ''
    }
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000']
  }
})
