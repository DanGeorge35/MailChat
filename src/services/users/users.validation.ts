/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Joi from 'joi'
import { type Request, type Response, type NextFunction } from 'express'
import { createErrorResponse, sendResponse } from '../../libs/helpers/response.helper'

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[a-zA-Z\d!@#$%^&*()-_+=]{6,}$/

const userCreateSchema = Joi.object({
  name: Joi.string().required().min(1),
  email: Joi.string().email().required().min(1),
  password: Joi.string().required().min(6).pattern(passwordRegex)
    .message('Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character')
})

const userUpdateSchema = Joi.object({
  name: Joi.string().required().min(1)
})

function checkValidation (error: any, value: null): {
  result: string
  message: any
} {
  if (error != null) {
    error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
    return { result: 'error', message: error.details[0].message }
  }
  return { result: 'success', message: value }
}

class UsersValidation {
  // ==============================================================================================
  /**
   * Validates user creation request.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<any>} A promise that resolves to void.
   */
  static async validateCreateUsers (req: Request, res: Response, next: NextFunction): Promise<any> {
    const { error, value } = userCreateSchema.validate(req.body)
    const validate = checkValidation(error, value)
    if (validate.result === 'error') {
      const resp = createErrorResponse(400, validate.message)()
      sendResponse(res, resp)
      return res.end()
    }
    next()
  }

  // ==============================================================================================

  /**
   * Validates user update request.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<any>} A promise that resolves to void.
   */
  static async validateUpdateUsers (req: Request, res: Response, next: NextFunction): Promise<any> {
    const { error, value } = userUpdateSchema.validate(req.body)
    const validate = checkValidation(error, value)
    if (validate.result === 'error') {
      const resp = createErrorResponse(400, validate.message)()
      sendResponse(res, resp)
      return res.end()
    }
    next()
  }
}

export default UsersValidation
