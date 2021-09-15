const express = require('express')
const router = express.Router();
const HashtagModel = require('../db/schemas/HashtagSchema')
const PostModel = require('../db/schemas/PostSchema');
const { fillPostAdditionalFields } = require('../utils');
require('./../typedefs');

router.get("/:id", async (req, res, next) => {
  /** @type { user } user */
  const user = req.session.user;

  /** @type { post[] } allPosts */
  const allPosts = await PostModel.find().sort({ "createdAt": "-1" }).lean();

  /** @type { hashtag }  */
  let hashtag = await HashtagModel.getHashtagWithPosts(req.params.id);

  const allPostsWithFromNow = hashtag.posts.map(post => fillPostAdditionalFields(post, allPosts))

  res.status(200).render('main', {
    page: 'topics',
    title: hashtag.hashtag,
    posts: allPostsWithFromNow,
    jwtUser: req.jwtUser,
    numOfUnreadNotifications: req.numberOfUnreadNotifications,
    numOfUnreadChats: req.numberOfUnreadChats,
    popularHashtags: req.mostPopularHashtags,
    user
  });
})


module.exports = router;