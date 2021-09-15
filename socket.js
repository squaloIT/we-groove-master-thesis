const socket = require('socket.io');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const ChatModel = require('./db/schemas/ChatSchema');
// app.set("io", io); //* In this way i made io global app variable
// let io = app.get("io"); //* And I can retreive it with app.get(io)
//* I can also put middleware that will attach io to thhe requst and pass it down the line
//* Or the last way would be to pass it as parameter to module I am require-ing
var socketIO = null;
const sessionsMap = {}; // TODO DELETE USERS FROM THIS OBJECT ON DISCONNECT
var io = null;

function connect(app) {
  io = socket(app, { pingTimeout: 60000 })

  io.on('connection', socket => {
    socketIO = socket;

    socket.on('saveSocketIDForUserID', data => {
      addSocketIDForUserID(data.jwtUser, data.socketId)
    })

    socket.on('typing', (room) => {
      socket.to(room).emit("typing")
    })

    socket.on('stop-typing', (room) => {
      socket.to(room).emit("stop-typing")
    })

    socket.on('joinRoom', (room) => {
      socket.join(room)
    })

    socket.on('join-call', (roomId, peerId, user) => {
      socket.join(roomId)
      socket.to(roomId).emit('user-connected-to-call', peerId, user, roomId)

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', peerId)
      })
    })

    socket.on('already-in-room', (user, roomId) => {
      setTimeout(() => {
        socket.to(roomId).emit("already-in-room", user)
      }, 1000)
    })

    socket.on('get-online-following', async (socketId) => {
      const user = findUserForSocketID(socketId);

      if (user) {
        const connectedUserIds = Object.keys(sessionsMap)
        const ids = user.following.filter(value => connectedUserIds.includes('' + value));
        const allConnectedFollowings = ids.map(id => sessionsMap[id].user)

        connectedUserIds.forEach(id => {
          if (id != "" + user._id && sessionsMap[id].user.following.includes(user._id)) {
            io.to(sessionsMap[id].socketID).emit('user-connected', user)
          }
        })

        io.to(socketId).emit('online-users', allConnectedFollowings)
      }
    })

    socket.on("video-call-started", async ({ chatId, socketId }, callback) => {
      const loggedUser = findUserForSocketID(socketId);
      const participantsUID = await ChatModel.getAllParticipantsInChat(chatId);
      /** @type chat */
      const chat = await ChatModel.findById(chatId);
      const uuid = uuidv4()

      callback(uuid);
      participantsUID.forEach(uid => {
        if (String(loggedUser._id) != uid && sessionsMap[uid].socketID) {
          io.to(sessionsMap[uid].socketID).emit('answer-video-call', { uuid, chat })
        }
      })
    })

    socket.on("audio-call-started", async ({ chatId, socketId }, callback) => {
      const loggedUser = findUserForSocketID(socketId);
      const participantsUID = await ChatModel.getAllParticipantsInChat(chatId);
      /** @type chat */
      const chat = await ChatModel.findById(chatId).populate("users");
      const uuid = uuidv4()

      callback(uuid);
      participantsUID.forEach(uid => {
        if (String(loggedUser._id) != uid) {
          io.to(sessionsMap[uid].socketID).emit('answer-audio-call', { uuid, chat })
        }
      })
    })

    socket.once('disconnect', onDisconnect)
  })
}


/**
 * 
 * @param {string} socketId 
 * @returns {string|null}
 */
function findUserForSocketID(socketID) {
  for (let key in sessionsMap) {
    if (sessionsMap[key] && sessionsMap[key].socketID == socketID) {
      return sessionsMap[key].user
    }
  }

  return null;
}
/**
 * 
 * @param {String} userID 
 */
function emitUserIdToRetreiveSocketId(userID) {
  socketIO.emit("getSocketIDForUserID", userID)
}
/**
 * 
 * @param {Array.<String>} userIds 
 * @param {message} message 
 */
function emitMessageToUsers(userIds, message) {
  userIds.forEach(_id => {
    if (sessionsMap[_id]) {
      const socketID = sessionsMap[_id].socketID
      io.to(socketID).emit('new-message', message)
    }
  })
}
/**
 * 
 * @param {String} jwtUser 
 * @param {String} socketID 
 */
function addSocketIDForUserID(jwtUser, socketID) {
  jwt.verify(jwtUser, process.env.SECRET_KEY, (err, verifiedJwtData) => {
    if (err) return;

    sessionsMap[verifiedJwtData._id] = { socketID, user: verifiedJwtData };
  })
}
/**
 * @param {String} userID 
 */
function deleteUserFromSessionMap(userId) {
  delete sessionsMap[userId];
}
/**
 * @param {notification} notification 
 * @param {Number} notificationNumber 
 */
function emitNotificationToUser(notification, notificationNumber) {
  const userID = notification.userTo._id || notification.userTo;
  const socketID = sessionsMap[userID]?.socketID

  if (socketID) {
    io.to(socketID).emit('new-notification', JSON.stringify({
      notification,
      notificationNumber
    }))
  } else {
    console.error("Couldn't find socketID for userId")
  }
}

function getIdsForOnlineUsers() {
  return Object.keys(sessionsMap);
}

function onDisconnect() {
  let userId = ''

  for (let key in sessionsMap) {
    if (sessionsMap[key] && sessionsMap[key].socketID == socket.id) {
      userId = key
      delete sessionsMap[key]
    }
  }

  io.emit("user-disconnected", userId)
}

module.exports = {
  connect,
  emitMessageToUsers,
  deleteUserFromSessionMap,
  emitUserIdToRetreiveSocketId,
  emitNotificationToUser,
  getIdsForOnlineUsers
}