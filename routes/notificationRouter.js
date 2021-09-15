const express = require('express')
const router = express.Router();
const NotificationModel = require('../db/schemas/NotificationSchema')

require('./../typedefs');

router.get('/', async (req, res, next) => {
  //TODO - Get all notifications

  const usersNotification = await NotificationModel.getAllNotificationsForUser(req.session.user._id)

  res.status(200).render('main', {
    title: "Notifications",
    page: 'notifications',
    user: req.session.user,
    jwtUser: req.jwtUser,
    numOfUnreadNotifications: req.numberOfUnreadNotifications,
    numOfUnreadChats: req.numberOfUnreadChats,
    popularHashtags: req.mostPopularHashtags,
    notifications: usersNotification
  });

  //TODO - Prebaciti ovo na klijenta tako da se taj api pozove cim se zeljena stranica ucita
  setTimeout(async () => {
    await NotificationModel.updateMany({
      userTo: req.session.user._id
    }, { seen: true })
  }, 2000)
})

module.exports = router;