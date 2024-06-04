/* eslint-disable @typescript-eslint/no-extraneous-class */
import dotenv from 'dotenv'
import { EncryptPassword, GenerateToken, CheckPassword } from '../../libs/utils/app.utility'
import { User } from '../../models'
import { getOrSetCache } from '../../config/redis'
import { type IResponse, createSuccessResponse, createErrorResponse, serverError, sendResponse } from '../../libs/helpers/response.helper'
import { type Request, type Response } from 'express'
import { Op } from 'sequelize'

const CACHE_EXPIRATION = 120

// Load environment variables from .env file
dotenv.config()
interface AuthRequest extends Request {
  user?: any
}

// Controller class for managing user-related operations
class UserController {
  // ==============================================================================================
  /**
   * Creates a new user.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async createUser (req: Request, res: Response): Promise<void> {
    try {
      const data = req.body

      // Check if the email already exists
      const checkExist = await User.findOne({ where: { email: data.email } })
      if (checkExist !== null) {
        const resp = createErrorResponse(400, 'Email Already Exists')()
        sendResponse(res, resp)
        return
      }

      // Generate a user code based on the maximum user ID
      const result: number = await User.max('id')
      const lastId = result ?? 0
      data.usercode = Math.floor(lastId + 1000)

      // Encrypt the user's password
      data.password = await EncryptPassword(data.password)

      // Create the user
      const user: any = await User.create(data)
      delete user.dataValues.password

      // Send success response
      const successResponse: IResponse = createSuccessResponse(user)
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError(error.message))
    }
  }

  // ==============================================================================================
  /**
   * Logs in a user.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async Login (req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      // Check if email and password are provided
      if (email === '' || password === '') {
        const resp = createErrorResponse(400, 'Email and password are required')()
        sendResponse(res, resp)
        return
      }

      // Find the user by email with password scope
      const user: any = await User.scope('withPassword').findOne({ where: { email } })
      if (user === null) {
        const resp = createErrorResponse(400, 'Email Address Not Found!')()
        sendResponse(res, resp)
        return
      }

      // Compare provided password with stored password
      const isValidPassword = await CheckPassword(password, user.password)
      if (!isValidPassword) {
        const resp = createErrorResponse(400, 'Incorrect Password!')()
        sendResponse(res, resp)
        return
      }
      delete user.dataValues.password

      // Generate authentication token
      const token = GenerateToken(user)

      // Send success response with token
      const successResponse: IResponse = createSuccessResponse(user, 200)
      successResponse.token = token
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError('LOGIN ERROR: ' + error.message))
    }
  }

  // ==============================================================================================
  /**
   * Gets a single user by ID.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async getSingleUser (req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      // Get user data from cache or database
      const dresult = await getOrSetCache(`users/${id}`, CACHE_EXPIRATION, async () => {
        const singleUser = await User.findOne({ where: { id } })
        return singleUser
      })

      // Check if user exists
      if (dresult == null) {
        const resp = createErrorResponse(400, `No User with the id ${id}`)()
        sendResponse(res, resp)
        return
      }

      // Send success response with user data
      const successResponse: IResponse = createSuccessResponse(dresult)
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError(error.message))
    }
  }

  // ==============================================================================================
  /**
   * Gets all users with pagination.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async getallOtherUsers (req: AuthRequest, res: Response): Promise<void> {
    const user = req.user.data
    const PAGE_SIZE = 10

    try {
      let page: number = 1
      const requestQuery: string = req.query.page as string ?? ''

      // Parse page number from query parameters
      if (requestQuery.length > 0) {
        page = parseInt(requestQuery, 10)
      }

      // Get users data from cache or database with pagination
      const dresult = await getOrSetCache(`users?page=${page}`, CACHE_EXPIRATION, async () => {
        const allUser = await User.findAndCountAll({
          where: {
            email: {
              [Op.ne]: user.email // Exclude the current user's email
            }
          },
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE
        })
        return allUser
      })

      const totalPages = Math.ceil(dresult.count / PAGE_SIZE)

      // Send success response with pagination data
      const successResponse: IResponse = createSuccessResponse(dresult)
      successResponse.pagination = {
        currentPage: page,
        totalPages,
        pageSize: PAGE_SIZE
      }
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError(error.message))
    }
  }

  // ==============================================================================================
  /**
   * Gets all users with pagination.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async getallUsers (req: AuthRequest, res: Response): Promise<void> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1
      const requestQuery: string = req.query.page as string ?? ''

      // Parse page number from query parameters
      if (requestQuery.length > 0) {
        page = parseInt(requestQuery, 10)
      }

      // Get users data from cache or database with pagination
      const dresult = await getOrSetCache(`users?page=${page}`, CACHE_EXPIRATION, async () => {
        const allUser = await User.findAndCountAll({
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE
        })
        return allUser
      })

      const totalPages = Math.ceil(dresult.count / PAGE_SIZE)

      // Send success response with pagination data
      const successResponse: IResponse = createSuccessResponse(dresult)
      successResponse.pagination = {
        currentPage: page,
        totalPages,
        pageSize: PAGE_SIZE
      }
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError(error.message))
    }
  }

  // ==============================================================================================
  /**
   * Gets all users with pagination.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async findUsers (req: Request, res: Response): Promise<void> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1
      const requestQuery: string = req.query.page as string ?? ''

      // Parse page number from query parameters
      if (requestQuery.length > 0) {
        page = parseInt(requestQuery, 10)
      }
      const { search } = req.params

      const allUser = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        },
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        order: [['name', 'ASC']] // Ordering by name in ascending order
      })

      const totalPages = Math.ceil(allUser.count / PAGE_SIZE)

      // Send success response with pagination data
      const successResponse: IResponse = createSuccessResponse(allUser)
      successResponse.pagination = {
        currentPage: page,
        totalPages,
        pageSize: PAGE_SIZE
      }
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError(error.message))
    }
  }
}

export default UserController
