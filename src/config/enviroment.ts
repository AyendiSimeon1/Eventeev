export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      url: process.env.DATABASE_URL
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'default-secret',
      expiresIn: '24h'
    },
    redis: {
      url: process.env.REDIS_URL
    }
  };