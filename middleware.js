const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const UserModel = require('./db/schemas/UserSchema');
const { createUserJWT } = require('./utils');
const ChatModel = require('./db/schemas/ChatSchema');
const NotificationModel = require('./db/schemas/NotificationSchema');
const HashtagModel = require('./db/schemas/HashtagSchema');

exports.checkIsLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

exports.isRememberedCookiePresent = (req, res, next) => {
  var cookie = req.signedCookies.rememberMe;
  // console.log('Cookies: ', JSON.stringify(req.cookies))
  // console.log('Cookies signed: ', JSON.stringify(req.signedCookies))

  if (cookie === undefined) {
    next();
    return;
  }

  jwt.verify(cookie, process.env.SECRET_KEY, async (err, verifiedJwtData) => {
    if (err) {
      console.log("ERROR IN JWT")
      next();
    } else {
      const user = await UserModel.findOne({ email: verifiedJwtData.email })

      if (!user) {
        console.log("User undefined")
        next();
      }

      const match = await bcrypt.compare(verifiedJwtData.password, user.password)
      if (!match) {
        console.log("Match undefined")
        next();
      }

      const userSessionData = user.getDataForSession()
      req.session.user = userSessionData;

      return res.redirect('/');
    }
  });
}

exports.generateUserJWT = (req, res, next) => {
  req.jwtUser = createUserJWT(req.session.user);
  next()
}

exports.getNumberOfUnreadChats = async (req, res, next) => {
  const unreadChats = await ChatModel.getAllChatsForUser(req.session.user._id)

  req.numberOfUnreadChats = unreadChats.filter(c =>
    c.latestMessage &&
    !c.latestMessage.readBy.map(s => String(s)).includes(req.session.user._id)
  ).length

  next()
}

exports.getNumberOfUnreadNotifications = async (req, res, next) => {
  const notifications = await NotificationModel.getAllNotificationsForUser(req.session.user._id, {
    seen: false
  })

  req.numberOfUnreadNotifications = notifications.length

  next()
}

exports.moveFilesToUploadAndSetFilesPath = async (req, res, next) => {
  var filePathArr = [];

  req.files.forEach(file => {
    const filePath = `uploads/images/${file.filename}.png`;
    const tempPath = file.path;
    const targetPath = path.join(__dirname, `./${filePath}`)
    fs.renameSync(tempPath, targetPath)
    filePathArr.push(filePath)
  })

  req.filesPathArr = filePathArr;
  next()
}


exports.getMostPopularHashtags = async (req, res, next) => {
  req.mostPopularHashtags = await HashtagModel.getMostPopularHashtags()
  next()
}