import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'

// Connection URL
mongoose.Promise = global.Promise

const start = async () => {
  let mongoUri = config.mongoUri
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 2500
    })
    console.info(`Connected to MongoDB at ${mongoUri}`)
  } catch (err) {
    console.warn(`Could not connect to MongoDB at ${mongoUri}. Starting embedded MongoDB with persistent storage...`)
    const { MongoMemoryServer } = require('mongodb-memory-server')
    const path = require('path')
    const fs = require('fs')
    const dbDir = path.resolve(process.cwd(), 'data/db')
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: dbDir,
        storageEngine: 'wiredTiger',
        dbName: 'mernproject'
      }
    })
    mongoUri = mongod.getUri() + 'mernproject'
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.info(`Connected to embedded MongoDB with persistent disk storage in ./data/db`)
  }

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB error: ${err.message}`)
  })

  app.listen(config.port, (err) => {
    if (err) {
      console.log(err)
    }
    console.info('Server started on port %s.', config.port)
  })
}

start()
