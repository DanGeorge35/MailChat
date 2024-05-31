/* eslint-disable @typescript-eslint/no-extraneous-class */
import dotenv from 'dotenv'
import { Message } from '../../models/messages.model'
import { getOrSetCache } from '../../config/redis'
import { type IResponse, createSuccessResponse, createErrorResponse, serverError, sendResponse } from '../../libs/helpers/response.helper'
import { type Request, type Response } from 'express'

const CACHE_EXPIRATION = 120

// Load environment variables from .env file
dotenv.config()

// Controller class for managing message-related operations
class MessageController {
  // ==============================================================================================
  /**
   * Creates a new message.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async createMessage (req: Request, res: Response): Promise<void> {
    try {
      const data = req.body

      // Create the message
      const message: any = await Message.create(data)

      // Send success response
      const successResponse: IResponse = createSuccessResponse(message)
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError(error.message))
    }
  }

  // ==============================================================================================
  /**
   * Gets a single message by ID.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async getSingleMessage (req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      // Get message data from cache or database
      const dresult = await getOrSetCache(`messages/${id}`, CACHE_EXPIRATION, async () => {
        const singleMessage = await Message.findOne({ where: { id } })
        return singleMessage
      })

      // Check if message exists
      if (dresult == null) {
        const resp = createErrorResponse(400, `No Message with the id ${id}`)()
        sendResponse(res, resp)
        return
      }

      // Send success response with message data
      const successResponse: IResponse = createSuccessResponse(dresult)
      sendResponse(res, successResponse)
    } catch (error: any) {
      // Send server error response
      sendResponse(res, serverError(error.message))
    }
  }

  // ==============================================================================================
  /**
   * Gets all messages with pagination.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async getallMessages (req: Request, res: Response): Promise<void> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1
      const requestQuery: string = req.query.page as string ?? ''

      // Parse page number from query parameters
      if (requestQuery.length > 0) {
        page = parseInt(requestQuery, 10)
      }

      // Get messages data from cache or database with pagination
      const dresult = await getOrSetCache(`messages?page=${page}`, CACHE_EXPIRATION, async () => {
        const allMessage = await Message.findAndCountAll({
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE
        })
        return allMessage
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
}

export default MessageController
