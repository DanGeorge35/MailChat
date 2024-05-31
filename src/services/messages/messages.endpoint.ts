import MessagesController from './messages.controller'
import { Authorization } from '../../libs/utils/app.utility'
import MessagesValidation from './messages.validation'

const ENDPOINT_URL = '/users'

// Endpoint configuration for user-related routes
const MessagesEndpoint = [

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [MessagesValidation.validateCreateMessages, MessagesController.createMessage]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [Authorization, MessagesController.getallMessages]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [MessagesController.getSingleMessage]
  }
]

export default MessagesEndpoint
