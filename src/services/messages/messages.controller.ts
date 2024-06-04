/* eslint-disable @typescript-eslint/no-extraneous-class */
import dotenv from 'dotenv'
import { Message, type MessageAttributes } from '../../models/messages.model'
import { User } from '../../models/user.model'
import { type IResponse, createSuccessResponse, createErrorResponse, serverError, sendResponse } from '../../libs/helpers/response.helper'
import { type Request, type Response } from 'express'
import { Op } from 'sequelize'

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
  static async createMessage (req: any, res: Response): Promise<void> {
    try {
      const user = req.user.data
      const data = req.body
      const toUser = await User.findOne({ where: { email: data.email } })
      data.toUserID = toUser?.dataValues.id
      data.fromUserID = user.id
      // Create the message
      const message: MessageAttributes = await Message.create(data)

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

      const singleMessage = await Message.findOne({ where: { id } })

      // Check if message exists
      if (singleMessage == null) {
        const resp = createErrorResponse(400, `No Message with the id ${id}`)()
        sendResponse(res, resp)
        return
      }

      // Send success response with message data
      const successResponse: IResponse = createSuccessResponse(singleMessage)
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

      const allMessage = await Message.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allMessage.count / PAGE_SIZE)

      // Send success response with pagination data
      const successResponse: IResponse = createSuccessResponse(allMessage)
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
   * Gets all messages with pagination.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<void>} A promise that resolves to void.
   */
  static async getAllUserMessages (req: Request, res: Response): Promise<void> {
    const PAGE_SIZE = 25

    const { userid } = req.params
    try {
      let page: number = 1
      const requestQuery: string = req.query.page as string ?? ''

      // Parse page number from query parameters
      if (requestQuery.length > 0) {
        page = parseInt(requestQuery, 10)
      }

      // Get messages data from cache or database with pagination

      const allMessage = await Message.findAndCountAll({
        where: {
          [Op.or]: [
            { toUserID: userid },
            { fromUserID: userid }
          ]
        },
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allMessage.count / PAGE_SIZE)

      // Send success response with pagination data
      const successResponse: IResponse = createSuccessResponse(allMessage)
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
