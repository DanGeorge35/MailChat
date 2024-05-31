/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST
} = process.env

// Check if all required environment variables are present
if ((DB_NAME == null) || (DB_USER == null) || (DB_PASS == null) || (DB_HOST == null)) {
  throw new Error('One or more required environment variables are missing.')
}

// Convert nullable string values to empty string if they are null or undefined
const dbName = DB_NAME ?? ''
const dbUser = DB_USER ?? ''
const dbPass = DB_PASS ?? ''

// Ensure that DB_HOST is not null or undefined before using it
if (!DB_HOST) {
  throw new Error('DB_HOST environment variable is missing.')
}

// Set up Sequelize connection
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: DB_HOST,
  dialect: 'mysql', // Adjust this according to your database type (e.g., 'mysql', 'postgres')
  port: 3306, // Adjust this according to your database port (e.g., 3306 for MySQL, 5432 for PostgreSQL)
  timezone: '+01:00'
})

// Test the connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.')
  })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error)
    process.exit(1) // Exit the process if unable to connect to the database
  })

export default sequelize
