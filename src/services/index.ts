import MessagesEndpoint from './messages/messages.endpoint'
import UsersEndpoint from './users/users.endpoint'

export default [
  ...UsersEndpoint,
  ...MessagesEndpoint
]
