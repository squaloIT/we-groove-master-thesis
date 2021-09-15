const path = require('path');
const fs = require('fs');
const express = require('express')
const router = express.Router();
const UserModel = require('../db/schemas/UserSchema')
const PostModel = require('../db/schemas/PostSchema')
const NotificationModel = require('../db/schemas/NotificationSchema')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
require('./../typedefs');
/**
 * Cover and profile photo uploading
 */
router.post('/upload/:photoType', upload.single('croppedImage'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      msg: "There was no image uploaded",
      status: 400
    })
  }

  const filePath = `uploads/images/${req.file.filename}.png`;
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, `./../${filePath}`)

  fs.rename(tempPath, targetPath, async err => {
    if (err) {
      console.log(err)
      return res.status(400).json({
        msg: "There was problem with renaming image",
        status: 400
      })
    }
    const objForUpdate = {}

    if (req.params.photoType == 'profile') {
      objForUpdate.profilePic = filePath
    }
    else if (req.params.photoType == 'cover') {
      objForUpdate.coverPic = filePath
    }

    req.session.user = await UserModel.findByIdAndUpdate(req.session.user._id, objForUpdate, { new: true })
      .catch(err => {
        console.log(err);
        return res.status(400).json({
          msg: 'There was an error trying to update the user!',
          status: 400
        })
      });

    res.status(200).json({
      data: req.session.user.profilePic,
      msg: 'Image successfully changed',
      status: 200
    })
  })
})
/**
 * Following and unfollowing route
 */
router.post('/:action/:profileId', async (req, res, next) => {
  if (!req.session.user._id || !req.params.profileId) {
    return res.status(400).json({
      msg: `There was an error while trying to ${req.params.action} user!`,
      status: 400
    })
  }
  try {
    var user = await UserModel.findByUsernameOrID(req.session.user._id)
    var profile = await UserModel.findByUsernameOrID(req.params.profileId)
  } catch (err) {
    return res.status(400).json({
      msg: `There was an error while trying to ${req.params.action} user!`,
      status: 400
    })
  }

  if (!user || !profile) {
    return res.status(400).json({
      msg: `There was an error while trying to ${req.params.action} user!`,
      status: 400
    })
  }

  if (req.params.action == 'follow') {
    user.following.push(req.params.profileId)
    profile.followers.push(user._id)
  }
  if (req.params.action == 'unfollow') {
    user.following.pull(req.params.profileId)
    profile.followers.pull(user._id)
  }
  Promise.all([
    profile.save(),
    user.save()
  ])
    .then(async ([newProfile, newUser]) => {
      req.session.user = newUser.getDataForSession()

      if (req.params.action == 'follow') {
        /** @type { notification } */
        const notification = new NotificationModel({
          userFrom: user._id,
          userTo: profile._id,
          notificationType: 'follow',
          entity: user._id
        })
        await notification.createNotification()
      }

      return res.status(201).json({
        msg: 'Operation successfull',
        status: 201,
        data: user
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(400).json({
        msg: `There was an error while trying to ${req.params.action} user!`,
        status: 400
      })
    })
})
/**
 * Get data for selected tab
 */
router.get('/:username/:tab', async (req, res, next) => {
  const tab = req.params.tab;
  const user = await UserModel.findByUsernameOrID(req.params.username)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  if (tab === 'likes' && user._id != req.session.user._id) {
    return res.redirect('/')
  }

  if (tab === 'following' || tab === 'followers') {
    const followingOrFollowers = await UserModel.getAllFollowersOrFollowingForUser(user._id, tab)
      .catch(err => {
        console.log(err);
        return res.redirect('/')
      })

    res.render('main', {
      page: 'followers_page',
      title: user.username,
      followingOrFollowers: followingOrFollowers[tab],
      active: tab,
      userProfile: user,
      jwtUser: req.jwtUser,
      numOfUnreadNotifications: req.numberOfUnreadNotifications,
      numOfUnreadChats: req.numberOfUnreadChats,
      popularHashtags: req.mostPopularHashtags,
      user: req.session.user
    })
  }
  else {
    /** @type { post } */
    const allUserPosts = await PostModel.findAllUserPosts(user._id, tab.toLowerCase())
      .catch(err => {
        console.log(err);
        return res.redirect('/')
      })

    let pinnedPost = null;
    if (tab == 'posts' || tab == 'replies') {
      pinnedPost = await PostModel.getPinnedPostForUserID(user._id, allUserPosts)
        .catch(err => {
          console.log(err);
          return res.redirect('/')
        })
    }

    res.render('main', {
      page: 'profile',
      title: user.username,
      posts: allUserPosts,
      active: tab,
      userProfile: user,
      jwtUser: req.jwtUser,
      user: req.session.user,
      numOfUnreadNotifications: req.numberOfUnreadNotifications,
      numOfUnreadChats: req.numberOfUnreadChats,
      popularHashtags: req.mostPopularHashtags,
      pinnedPost
    })
  }
})

router.get('/:username', async (req, res, next) => {
  const user = await UserModel.findByUsernameOrID(req.params.username)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  const allUserPosts = await PostModel.findAllUserPosts(user._id)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  let pinnedPost = await PostModel.getPinnedPostForUserID(user._id, allUserPosts)
    .catch(err => {
      console.log(err);
      return res.redirect('/')
    })

  res.render('main', {
    page: 'profile',
    title: user.username,
    posts: allUserPosts,
    active: "Posts",
    userProfile: user,
    user: req.session.user,
    jwtUser: req.jwtUser,
    numOfUnreadNotifications: req.numberOfUnreadNotifications,
    numOfUnreadChats: req.numberOfUnreadChats,
    popularHashtags: req.mostPopularHashtags,
    pinnedPost
  })
})


module.exports = router;