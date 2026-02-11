import Redis from 'ioredis'
import { ThrottlerStorage } from '@nestjs/throttler'
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface'

export class RedisThrottlerStorageService implements ThrottlerStorage {
  private readonly redis: Redis

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl, { maxRetriesPerRequest: null })
  }

  async increment(key: string, ttl: number): Promise<ThrottlerStorageRecord> {
    const totalHits = await this.redis.incr(key)
    let timeToExpire = await this.redis.ttl(key)
    if (timeToExpire === -1) {
      await this.redis.expire(key, ttl)
      timeToExpire = ttl
    }

    return {
      totalHits,
      timeToExpire: Math.max(timeToExpire, 0) * 1000
    }
  }
}
