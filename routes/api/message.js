const express = require('express');
const router = express.Router();
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const ChatModel = require('../../db/schemas/ChatSchema');
const NotificationModel = require('../../db/schemas/NotificationSchema');
const Message = require('./../../db/schemas/MessageSchema')
const { emitMessageToUsers } = require('../../socket');
const { moveFilesToUploadAndSetFilesPath } = require('./../../middleware');
const UserModel = require('../../db/schemas/UserSchema');
const MessageModel = require('./../../db/schemas/MessageSchema');
require('./../../typedefs');

router.post('/sendMessage', upload.array('images', 5), moveFilesToUploadAndSetFilesPath, async (req, res) => {
  const chatId = req.body.chatId
  const content = req.body.content
  const senderId = req.session.user._id

  if (!chatId || !content) {
    return res.status(400).json({
      data: null,
      status: 400,
      msg: "Provide all values"
    })
  }

  try {
    /** @type { message } */
    let newMessage = await Message({
      content,
      sender: senderId,
      chat: chatId,
      readBy: [senderId],
      images: req.filesPathArr
    }).save()

    let messageToPopulate = await Message.findById(newMessage._id).lean()

    messageToPopulate = await ChatModel.populate(messageToPopulate, { path: 'chat', options: { lean: true } });
    messageToPopulate = await UserModel.populate(messageToPopulate, { path: 'chat.users', options: { lean: true } });
    messageToPopulate = await MessageModel.populate(messageToPopulate, { path: 'chat.latestMessage', options: { lean: true } });
    messageToPopulate = await UserModel.populate(messageToPopulate, { path: 'sender', options: { lean: true } });

    messageToPopulate = {
      ...messageToPopulate,
      chat: {
        ...messageToPopulate.chat,
        users: messageToPopulate.chat.users.filter(u => u._id != senderId)
      }
    }

    const chat = await ChatModel.findByIdAndUpdate(chatId, {
      latestMessage: newMessage._id
    }, { new: true });

    const userIds = chat.users.filter(_id => _id != senderId)

    res.status(200).json({
      data: messageToPopulate,
      status: 200,
      msg: "success"
    })

    emitMessageToUsers(userIds, messageToPopulate);
    addNotificationsToUsers(userIds, newMessage);

  } catch (err) {
    console.error(err)

    return res.status(500).json({
      data: null,
      status: 500,
      msg: err
    })
  }
});

router.get('/unread-number', async (req, res) => {
  const unreadChats = await ChatModel.getAllChatsForUser(req.session.user._id)
    .catch(err => {
      console.log(err)

      res.status(400).json({
        data: null,
        msg: 'Error while getting number of unread messages',
        status: 400
      });
    })

  const numberOfUnreadChats = unreadChats.filter(c =>
    c.latestMessage &&
    !c.latestMessage.readBy.map(s => String(s)).includes(req.session.user._id)
  ).length

  res.status(200).json({
    data: numberOfUnreadChats,
    msg: '',
    status: 200
  });
})

router.post('/seen-chat-messages', async (req, res) => {
  const chatId = req.body.chatId;
  const userId = req.session.user._id;

  await MessageModel.updateMany({ chat: chatId }, {
    $addToSet: {
      readBy: userId
    }
  })
    .catch(err => {
      console.log(err);
      res.status(400).send()
    })

  res.status(200).json({
    msg: "Messages seen",
    status: 200,
    data: null
  })
})

/**
 * 
 * @param {Array.<string>} userIds 
 * @param {message} message 
 */
function addNotificationsToUsers(userIds, message) {
  userIds.forEach(async id => {
    if (id) {
      /** @type { notification } */
      const notification = new NotificationModel({
        userTo: id,
        userFrom: message.sender,//* this is id
        notificationType: 'new-message',
        entity: message.chat //* this is id
      })
      await notification.createNotification();
    }
  })
}

module.exports = router;