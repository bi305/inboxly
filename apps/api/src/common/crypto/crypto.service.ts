import { Injectable } from '@nestjs/common'
import crypto from 'crypto'

@Injectable()
export class CryptoService {
  private getKey(): Buffer {
    const key = process.env.APP_ENCRYPTION_KEY
    if (!key) {
      throw new Error('APP_ENCRYPTION_KEY is required')
    }
    const raw = Buffer.from(key, 'base64')
    if (raw.length !== 32) {
      throw new Error('APP_ENCRYPTION_KEY must be 32 bytes base64-encoded')
    }
    return raw
  }

  encrypt(plaintext: string): { ciphertext: string; iv: string; tag: string } {
    const key = this.getKey()
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    return {
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    }
  }

  decrypt(ciphertext: string, iv: string, tag: string): string {
    const key = this.getKey()
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'))
    decipher.setAuthTag(Buffer.from(tag, 'base64'))
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(ciphertext, 'base64')),
      decipher.final()
    ])
    return plaintext.toString('utf8')
  }

  hashVerifyToken(token: string): string {
    const secret = process.env.VERIFY_TOKEN_SECRET
    if (!secret) {
      throw new Error('VERIFY_TOKEN_SECRET is required')
    }
    return crypto.createHmac('sha256', secret).update(token).digest('base64')
  }

  timingSafeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
  }
}
