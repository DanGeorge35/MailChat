import { User } from './user.model'
import { Message, type MessageCreationAttributes, type MessageAttributes } from './messages.model'

Message.belongsTo(User, { as: 'toUserInfo', foreignKey: 'toUserID' })
Message.belongsTo(User, { as: 'fromUserInfo', foreignKey: 'fromUserID' })

User.sync({ alter: true })
  .then(() => {
    Message.sync({ alter: true })
      .then(() => {})
      .catch((err: Error) => {
        console.error('Error creating Message table:', err)
      })
  })
  .catch((err: Error) => {
    console.error('Error creating User table:', err)
  })

export { User, Message, type MessageCreationAttributes, type MessageAttributes }
