import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import endpoints from './services'
import RouteHelper from './libs/helpers/route.helper'

const app = express()
dotenv.config()

// -----------------------------------------------------
// Middleware Configuration
// -----------------------------------------------------

// CORS options configuration
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Enable cookies or other credentials
}

// Security middleware
app.use(helmet())

// Middleware for parsing application/json
app.use(express.json({ limit: '100kb' }))

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Middleware for handling CORS
app.use(cors(corsOptions))

// -----------------------------------------------------
// Route Initialization
// -----------------------------------------------------

try {
  RouteHelper.initRoutes(endpoints, app)
} catch (error) {
  console.error('Error initializing routes:', error)
}

// -----------------------------------------------------
// Server Initialization
// -----------------------------------------------------

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
