const express = require('express')
const router = express.Router();
const PostModel = require('../db/schemas/PostSchema')
var moment = require('moment');
require('./../typedefs');

router.get("/", async (req, res, next) => {
  /** @type { user } user */
  const user = req.session.user;

  /** @type { post[] } allPosts */
  let allPosts = await PostModel.getAllPosts(user);

  const allPostsWithFromNow = allPosts
    .filter(post => post.postedBy != user._id && post.replyTo?.postedBy?._id != user._id)
    .map(post => {
      if (post.retweetData) {
        return {
          ...post,
          fromNow: moment(post.createdAt).fromNow(),
          retweetData: {
            ...post.retweetData,
            fromNow: moment(post.retweetData.createdAt).fromNow()
          }
        }
      } else {
        return {
          ...post,
          fromNow: moment(post.createdAt).fromNow()
        }
      }
    });

  res.status(200).render('main', {
    page: 'home',
    title: "Home",
    posts: allPostsWithFromNow,
    jwtUser: req.jwtUser,
    numOfUnreadNotifications: req.numberOfUnreadNotifications,
    numOfUnreadChats: req.numberOfUnreadChats,
    popularHashtags: req.mostPopularHashtags,
    user
  });
})


router.get("/offline", async (req, res, next) => {
  res.status(200).render('offline_page', {
    title: "Offline"
  });
})


module.exports = router;