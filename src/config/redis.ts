import * as redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()

const {
  REDIS_HOST
} = process.env

const redisClient = redis.createClient({
  LegacyMode: true,
  socket: {
    host: REDIS_HOST, // This should match the service name defined in the Docker Compose file
    port: 6379 // Redis default port
  }
} as any)

// Connect to Redis
redisClient.on('connect', () => {
  console.log('Redis connected successfully.')
})

// Handle Redis connection errors
redisClient.on('error', (error) => {
  console.error('Unable to connect to Redis server:', error)
})

redisClient.connect()
  .then((result) => { console.log('Redis Connected successfully.', result) })
  .catch((error) => { console.error('Unable to connect to Redis Server:', error) })

async function getOrSetCache (key: string, ttl: number, cb: any): Promise<any> {
  return await new Promise((resolve, reject) => {
    redisClient.get(key)
      .then(async (data) => {
        if (data != null) {
          resolve(JSON.parse(data))
        } else {
          const newdata = await cb()
          await redisClient.setEx(key, ttl, JSON.stringify(newdata))
          resolve(newdata)
        }
      })
      .catch((error) => { reject(error) })
  })
}

export { getOrSetCache, redisClient }
