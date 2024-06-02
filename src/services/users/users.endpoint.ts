import UsersController from './users.controller'
import { Authorization } from '../../libs/utils/app.utility'
import UsersValidation from './users.validation'

const ENDPOINT_URL = '/users'

// Endpoint configuration for user-related routes
const UsersEndpoint = [
  // ==============================================================================================
  {
    path: '/auth',
    method: 'post',
    handler: [UsersController.Login]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [UsersValidation.validateCreateUsers, UsersController.createUser]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:search/findusers`,
    method: 'get',
    handler: [Authorization, UsersController.findUsers]
  },
  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [Authorization, UsersController.getallUsers]
  },

  // ==============================================================================================
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [UsersController.getSingleUser]
  }
]

export default UsersEndpoint
