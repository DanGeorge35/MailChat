/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Server } from 'socket.io'
import { type Server as HttpServer } from 'http'
import jwt from 'jsonwebtoken'
import { Message, type MessageAttributes } from '../../models/messages.model'
import { User } from '../../models/user.model'
import Joi from 'joi'

const MessageContentSchema = Joi.object({
  contentType: Joi.string().valid('image', 'video', 'text', 'audio').required(),
  data: Joi.string().required().min(1)
})

const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (token !== null) {
      console.log('Authentication error')
      next(new Error('Authentication error')); return
    }

    try {
      const decoded: any = jwt.verify(token, process.env.jwtkey!)
      socket.data.user = decoded.data
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.data.user.FirstName}  ${socket.data.user.LastName}`)

    // Join a room based on user ID
    await socket.join(`user-${socket.data.user.id}`)

    socket.emit('userConnected', {
      name: `${socket.data.user.FirstName}  ${socket.data.user.LastName}`,
      id: socket.data.user.id
    })

    socket.on('directMessage', async ({ subject, content, toid }) => {
      const fromUser: any = await User.findOne({ where: { id: socket.data.user.id } })
      const toUser: any = await User.findOne({ where: { id: toid } })
      if (fromUser == null) {
        socket.emit('Error', {
          message: `id ${toid} not found`
        })
      }

      if (toUser == null) {
        socket.emit('Error', {
          message: 'Authentication Error, Kindly Logout, and Login Again'
        })
      }

      const { error } = MessageContentSchema.validate(content)
      if (error != null) {
        error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
        if (toUser == null) {
          socket.emit('Error', {
            message: error.details[0].message
          })
        }
      } else {
        content = JSON.stringify(content)
        const dMsg: MessageAttributes = {
          content,
          subject,
          isRead: false,
          fromUserID: socket.data.user.id,
          toUserID: toid
        }
        const message: MessageAttributes = await Message.create(dMsg)
        if (toUser !== null) {
          io.to(`user-${toid}`).emit('directMessage', {
            fromUser: fromUser.name,
            content: message.content,
            subject: message.subject,
            createdAt: message.createdAt
          })
        }
      }
    })

    socket.on('signal', ({ toid, signalData }) => {
      console.log(`Sending signal to ${toid}`)

      io.to(`user-${toid}`).emit('signal', {
        fromid: socket.data.user.id,
        signalData
      })
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.FirstName}  ${socket.data.user.LastName}`)
    })
  })

  return io
}

export default setupSocket
/*
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
*/
