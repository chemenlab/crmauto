import dotenv from 'dotenv'
import { createApp } from './app'
import { prisma, disconnect } from './config/database'
import { redis } from './config/redis'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 4000

/**
 * Start server
 */
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected')

    // Create Express app
    const app = createApp()

    // Start listening
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📝 Health check: http://localhost:${PORT}/health`)
      console.log(`🔌 API: http://localhost:${PORT}/api/v1`)
    })

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...')

      server.close(async () => {
        await disconnect()
        await redis.quit()
        console.log('👋 Server closed')
        process.exit(0)
      })

      // Force shutdown after 10s
      setTimeout(() => {
        console.error('⚠️  Forced shutdown')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', gracefulShutdown)
    process.on('SIGINT', gracefulShutdown)

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
