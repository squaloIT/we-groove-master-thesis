import { io } from "socket.io-client";
import { hideTypingDots, showTypingDots } from "./utils/dom-manipulation";
import { onCallDisplayRinging, onDisconnectRemoveFriendFromList, onFindingOnlineUsers, onFriendConnectionAddToList, onNewMessage, onNewNotification } from "./utils/listeners";
var socket = null;

function connectClientSocket(jwtUser) {
  socket = io(process.env.SERVER_URL)
  socket.on('connect', () => {
    console.log("CONNECTED")
    console.log(socket)
    socket.emit("saveSocketIDForUserID", {
      jwtUser,
      socketId: socket.id
    })

    if (window.location.pathname.indexOf('/call_room') !== 0) {
      socket.on('new-notification', onNewNotification);
      socket.on('new-message', onNewMessage);
      socket.on('typing', showTypingDots);
      socket.on('stop-typing', hideTypingDots)
      socket.on('online-users', onFindingOnlineUsers)
      socket.on('user-connected', onFriendConnectionAddToList)
      socket.on('user-disconnected', onDisconnectRemoveFriendFromList)
      socket.emit("get-online-following", socket.id)
    }

    socket.on('answer-audio-call', data => onCallDisplayRinging('audio', data))
    socket.on('answer-video-call', data => onCallDisplayRinging('video', data))
  })
}

function emitAudioCallStartedForChat(chatId) {
  socket.emit("audio-call-started", { chatId, socketId: socket.id }, (uuid) => {
    window.location.href = "/call_room/audio/" + uuid
  })
}

function emitVideoCallStartedForChat(chatId) {
  socket.emit("video-call-started", { chatId, socketId: socket.id }, (uuid) => {
    window.location.href = "/call_room/video/" + uuid
  })
}

function emitTypingToRoom(room) {
  socket.emit("typing", room)
}

function emitStopTypingToRoom(room) {
  socket.emit("stop-typing", room)
}

function emitJoinRoom(room) {
  socket.emit("joinRoom", room)
}

export {
  connectClientSocket,
  emitTypingToRoom,
  emitStopTypingToRoom,
  emitAudioCallStartedForChat,
  emitVideoCallStartedForChat,
  emitJoinRoom
};

