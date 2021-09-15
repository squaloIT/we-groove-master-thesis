const express = require('express')
const router = express.Router();

require('./../typedefs');

router.get('/:searchType', (req, res, next) => {
  const searchType = req.params.searchType.toLowerCase();

  res.status(200).render('main', {
    title: "Search",
    page: 'search',
    jwtUser: req.jwtUser,
    user: req.session.user,
    numOfUnreadNotifications: req.numberOfUnreadNotifications,
    numOfUnreadChats: req.numberOfUnreadChats,
    popularHashtags: req.mostPopularHashtags,
    active: searchType
  });
})

module.exports = router;