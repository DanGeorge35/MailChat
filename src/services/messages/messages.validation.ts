import Joi from 'joi'
import { type Request, type Response, type NextFunction } from 'express'
import { createErrorResponse, sendResponse } from '../../libs/helpers/response.helper'

const messageCreateSchema = Joi.object({
  subject: Joi.string().required().min(1),
  content: Joi.string().required().min(1),
  email: Joi.string().required().min(1)
})

interface ValidationResult {
  result: string
  message: any
}

function checkValidation (error: any, value: any): ValidationResult {
  if (error !== null && error !== undefined) {
    error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
    return { result: 'error', message: error.details[0].message }
  }
  return { result: 'success', message: value }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class MessagesValidation {
  /**
   * Validates message creation request.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {void}
   */
  static async validateCreateMessages (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { error, value } = messageCreateSchema.validate(req.body)
    const validate = checkValidation(error, value)
    if (validate.result === 'error') {
      const resp = createErrorResponse(400, validate.message)()
      sendResponse(res, resp)
      res.end()
      return
    }
    next()
  }
}

export default MessagesValidation
