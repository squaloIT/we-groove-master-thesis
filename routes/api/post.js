const moment = require('moment');
const express = require('express')
const router = express.Router();
const PostModel = require('../../db/schemas/PostSchema')
const UserModel = require('../../db/schemas/UserSchema')
const { moveFilesToUploadAndSetFilesPath } = require('../../middleware');
const NotificationModel = require('../../db/schemas/NotificationSchema');
var multer = require('multer');
const HashtagModel = require('../../db/schemas/HashtagSchema');
var upload = multer({ dest: 'uploads/' })
require('../../typedefs');

router.post('/', upload.array('images', 5), moveFilesToUploadAndSetFilesPath, async (req, res, next) => {
  if (hasRequiredDataToCreatePost(req)) {
    return res.sendStatus(400);
  }
  try {
    /** @type { post } createdPost */
    var newPost = new PostModel({
      content: req.body.content,
      pinned: false,
      postedBy: req.session.user,
      images: req.filesPathArr
    });

    //* Populate will populate any ObjectID field with data from model specified before populate keyword.
    newPost = await UserModel.populate(newPost, { path: 'postedBy' });

    /** @type { post } savedPost */
    const savedPost = await newPost.save();

    await HashtagModel.createHashTagsForPost(savedPost)

    return res.status(savedPost ? 201 : 400).json({
      msg: savedPost ? "Post successfully saved" : "There was an error while saving post",
      status: savedPost ? 201 : 400,
      data: { createdPost: newPost }
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: "Error while trying to add new post!", status: 500 })
  }
});

router.post('/replyTo/:id', upload.array('images', 5), moveFilesToUploadAndSetFilesPath, async (req, res, next) => {
  if (hasRequiredDataToCreatePost(req)) {
    return res.sendStatus(400);
  }
  try {
    const postId = req.body._id;
    if (!postId) {
      throw new Error("No postId sent")
    }
    /** @type { post } createdPost */
    var createdPost = new PostModel({
      content: req.body.content,
      pinned: false,
      postedBy: req.session.user,
      replyTo: postId,
      images: req.filesPathArr
    })

    //* Populate will populate any ObjectID field with data from model specified before populate keyword.
    createdPost = await UserModel.populate(createdPost, { path: 'postedBy' });

    /** @type { post } savedPost */
    const savedPost = await createdPost.save();

    await HashtagModel.createHashTagsForPost(savedPost)

    const postWithReplyTo = await PostModel.populate(createdPost, { path: 'replyTo' });
    /** @type { notification } */
    const notification = new NotificationModel({
      userFrom: req.session.user._id,
      userTo: postWithReplyTo.replyTo.postedBy,
      notificationType: 'comment',
      entity: postWithReplyTo.replyTo
    })
    await notification.createNotification();

    return res.status(savedPost ? 201 : 400).json({
      msg: savedPost ? "Post successfully saved" : "There was an error while saving post",
      status: savedPost ? 201 : 400,
      data: { createdPost }
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: "Error while trying to add new post!", status: 500 })
  }
});

router.put('/like', async (req, res) => {
  /** @type { String } postId */
  const postId = req.body._id; //! This is always value of real post, not retweet ( secured that on front )

  if (!postId) {
    res.status(400).json({
      msg: "There was an error trying to like the post, please try again later thank you",
      status: 400
    });
  }

  const retweetsAndPosts = await PostModel.find({
    $or: [
      {
        _id: postId
      }, {
        retweetData: postId
      }
    ]
  }).lean();
  const ids = retweetsAndPosts.map(p => p._id);

  /** @type { String } userId */
  const userId = req.session.user._id;

  /** @type { Boolean } isLiked */
  const isLiked = req.session.user.likes && req.session.user.likes.includes(postId)

  /** @type { String } option */
  let option = isLiked ? "$pullAll" : "$addToSet";

  /** @type { user } newUserWithLikes */
  const newUserWithLikes = await UserModel.findByIdAndUpdate(userId, {
    [option]: {
      likes: ids
    }
  }, { new: true })

  req.session.user = newUserWithLikes;

  option = isLiked ? "$pull" : "$addToSet";
  /** @type { post } newPostWithLikes */
  const newPostWithLikes = await PostModel.findByIdAndUpdate(postId, {
    [option]: {
      likes: userId
    }
  }, { new: true })

  if (!isLiked) {
    /** @type { notification } */
    const notification = new NotificationModel({
      userFrom: req.session.user._id,
      userTo: newPostWithLikes.postedBy,
      notificationType: 'like',
      entity: newPostWithLikes._id
    })
    await notification.createNotification()
  }

  res.status(201).json({
    status: 201,
    msg: isLiked ? "Post unliked" : "Post liked",
    data: {
      isLiked: option == "$addToSet",
      post: newPostWithLikes
    }
  })
})

router.put('/pin/:postId', async (req, res) => {
  const pinned = req.body.pinned;

  try {
    /** @type { post } */
    await PostModel.updateOne({ pinned: true, "postedBy": req.session.user._id }, { pinned: false })
    var newPost = await PostModel.findByIdAndUpdate(req.params.postId, { pinned }, { new: true })
      .populate("postedBy")
      .lean()
  }
  catch (err) {
    console.log(err)
    res.status(400).json({
      msg: "There was an error trying to pin the post, please try again later thank you",
      status: 400
    });
  }

  newPost.fromNow = moment(newPost.createdAt).fromNow()
  res.status(200).json({
    status: 200,
    msg: newPost.pinned ? "Post pinned" : "Post unpinned",
    data: newPost
  })
})

router.put('/retweet', async (req, res) => {
  /** @type { String } postId */
  const postId = req.body._id;
  /** @type { String } userId */
  const userId = req.session.user._id;

  if (!postId) {
    res.status(400).json({
      msg: "There was an error trying to retweet the post, please try again later thank you",
      status: 400
    });
  }

  //* There can't be two retweeted post from the same user for the same post
  /** @type { post } deletedPost */
  const deletedPost = await PostModel.findOneAndDelete({ postedBy: userId, retweetData: postId })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        msg: "There was an error trying to retweet the post, please try again later thank you",
        status: 400
      });
    })

  /** @type { String } option */
  const option = deletedPost ? "$pull" : "$addToSet";
  /** @type { post } repost */
  var repost = deletedPost;

  //*If there is no deletedPost it means that there was no already retweeted posts so I need to created it 
  if (repost == null) {
    repost = await PostModel.create({ postedBy: userId, retweetData: postId })
  }

  req.session.user = await UserModel.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        msg: "There was an error trying to retweet the post, please try again later thank you",
        status: 400
      });
    });

  /** @type { post } post */
  const post = await PostModel.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        msg: "There was an error trying to retweet the post, please try again later thank you",
        status: 400
      });
    });

  if (!deletedPost) {
    /** @type { notification } */
    const notification = new NotificationModel({
      userFrom: req.session.user._id,
      userTo: post.postedBy,
      notificationType: 'retweet',
      entity: post._id
    })
    await notification.createNotification()
  }

  res.status(201).json({
    status: 201,
    msg: deletedPost ? "Post unretweeted" : "Post retweeted",
    data: {
      isRetweeted: option == "$addToSet",
      post
    }
  })
})

router.get('/:id', async (req, res) => {
  /** @type { post } */
  const post = await PostModel.getPostWithID(req.params.id)

  return res.status(200).json({
    msg: "Successfully founded post",
    status: 200,
    data: post
  })
})

router.put('/delete/:id', async (req, res) => {
  /** @type { String } userId */
  const userId = req.session.user._id;

  /** @type { post } */
  const post = await PostModel.findByIdAndDelete(req.params.id)
    .catch(err => {
      console.log(err);
      res.status(400).json({
        msg: "There was an error while trying to delete post",
        status: 400,
      })
    })

  if (post) {
    await PostModel.deleteMany({ $or: [{ retweetData: post._id }, { replyTo: post._id }] })
      .catch(err => {
        console.log(err);
        res.status(400).json({
          msg: "There was an error while trying to delete post",
          status: 400,
        })
      })

    if (post.retweetData) {
      await PostModel.findByIdAndUpdate(post.retweetData, {
        $pull: { retweetUsers: userId }
      })
    }

    await UserModel.updateMany({}, { $pull: { likes: post._id } })
    await UserModel.updateMany({}, { $pull: { retweets: post._id } })

    req.session.user = await UserModel.findById(userId)

    return res.status(200).json({
      msg: "Successfully deleted post",
      status: 204,
      data: post,
      retweetedPost: post.retweetData ? post.retweetData : null
    })
  }

  return res.status(200).json({
    msg: "There was no post to be deleted",
    status: 200,
    data: post,
    retweetedPost: null
  })
})

function hasRequiredDataToCreatePost(req) {
  return (!req.body.content && req.filesPathArr.length == 0) || !req.session.user
}

module.exports = router;