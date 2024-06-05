import MessagesController from './messages.controller'
import { Authorization } from '../../libs/utils/app.utility'
import MessagesValidation from './messages.validation'

const ENDPOINT_URL = '/messages'

// Endpoint configuration for user-related routes
const MessagesEndpoint = [

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [Authorization, MessagesValidation.validateCreateMessages, MessagesController.createMessage]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [Authorization, MessagesController.getallMessages]
  },
  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:userid/user/sent`,
    method: 'get',
    handler: [Authorization, MessagesController.getAllUserSentMessages]
  },
  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:userid/user/inbox`,
    method: 'get',
    handler: [Authorization, MessagesController.getAllUserInboxMessages]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:userid/user/metrics`,
    method: 'get',
    handler: [MessagesController.getUserMessageMetrics]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:userid/user`,
    method: 'get',
    handler: [Authorization, MessagesController.getAllUserMessages]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [Authorization, MessagesController.getSingleMessage]
  }
]

export default MessagesEndpoint
