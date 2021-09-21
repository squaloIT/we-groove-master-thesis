const express = require('express');
const router = express.Router();
const { fillPostAdditionalFields } = require('../../utils');
const PostModel = require('./../../db/schemas/PostSchema')
const UserModel = require('./../../db/schemas/UserSchema')
require('./../../typedefs');

router.get('/inbox/:searchTerm', async (req, res) => {
  const filter = { $regex: req.params.searchTerm, $options: "i" };

  try {
    let users = await UserModel.find({
      $or: [
        { username: filter },
        { fullName: filter }
      ],
      $and: [{
        _id: {
          $ne: req.session.user._id
        }
      }]
    }).lean()

    users = setIsFollowedForUsers(users, req)

    return res.status(200).json({
      msg: "Successfully found users",
      data: users,
      status: 200
    });

  } catch (err) {
    console.log(err)
    res.status(400).json({
      msg: "There was an error while trying to find users",
      status: 400,
      data: null
    })
  }
});

router.get('/:type/:searchTerm', async (req, res) => {
  var results = null;
  const filter = { $regex: req.params.searchTerm, $options: "i" };

  if (req.params.type == 'posts') {
    const allPosts = await PostModel.getAllPosts(req.session.user)
    results = await PostModel.find({ content: filter }).lean()

    results = results.map(post => {
      /** @type { post } */
      const p = fillPostAdditionalFields(post, allPosts)

      p.hasDelete = p.postedBy._id == req.session.user._id
      p.isLiked = p.likes.map(id => String(id)).includes(req.session.user._id)
      p.isRetweeted = p.retweetUsers.map(id => String(id)).includes(req.session.user._id)

      return p
    })
  }
  else if (req.params.type == 'users') {
    results = await UserModel.getUsersForSearch(req.params.searchTerm)
    results = setIsFollowedForUsers(results, req)
  }

  return res.status(200).json({
    msg: "Successfully founded search results",
    status: 200,
    data: results
  })
})

function setIsFollowedForUsers(results, req) {
  return results.map(user => ({
    ...user,
    isFollowed: req.session.user.following.map(id => String(id)).includes(String(user._id))
  }))
}

module.exports = router;