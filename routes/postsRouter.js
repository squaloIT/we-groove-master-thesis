const express = require('express')
const router = express.Router();
const PostModel = require('../db/schemas/PostSchema')
require('./../typedefs');

//Ostale rute ispred ove jer sve rute upadaju u ovu kategoriju

router.get("/:id", async (req, res, next) => {
  /** @type { user } user */
  const user = req.session.user;
  const postID = req.params.id;

  /** @type { post } */
  const post = await PostModel.getPostWithID(postID)
    .catch(err => {
      console.error(err);
      return res.status(400).json({
        msg: "There was an error while trying to get post!",
        status: 400
      })
    })

  const repliesForPost = await PostModel.getRepliesForPost(postID);

  res.status(200).render('main', {
    page: 'post',
    title: "View Post",
    post,
    repliesForPost,
    jwtUser: req.jwtUser,
    numOfUnreadNotifications: req.numberOfUnreadNotifications,
    numOfUnreadChats: req.numberOfUnreadChats,
    popularHashtags: req.mostPopularHashtags,
    user
  });
})


module.exports = router;