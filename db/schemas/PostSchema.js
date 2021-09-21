const mongoose = require('mongoose');
const UserModel = require('./UserSchema');
const moment = require('moment');
const { getNumberOfCommentsForPost, fillPostAdditionalFields, colorHashtagsInText, filterPostsForSelectedTab } = require('../../utils');
const HashtagModel = require('./HashtagSchema');
require('./../../typedefs')

const PostSchema = new mongoose.Schema({
  content: { type: String, trim: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pinned: Boolean,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  images: [{ type: String }],
  retweetData: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
}, { timestamps: true });

PostSchema.pre('find', function (next) {
  this.populate('postedBy')
  this.populate('retweetData')
  this.populate('replyTo');
  next()
})

PostSchema.post('findOneAndDelete', async function (doc, next) {
  if (doc) {
    await HashtagModel.updateMany({ posts: doc._id }, {
      $pull: {
        posts: doc._id
      },
      $inc: {
        postsLength: -1
      }
    }, { new: true })

    next()
  }

  next()
});

/**
 * @param { user }
 * @returns post[] */
PostSchema.statics.getAllPosts = async (user) => {
  /** @type { post[] } allPosts */
  var allPosts = await PostModel
    .find({ postedBy: { "$in": [...user.following, user._id] } })
    .sort({ "createdAt": "-1" })
    .lean()
  //.lean gives me JS object instead of mongoose model which was the case without .lean

  allPosts = allPosts.map(post => ({
    ...post,
    content: colorHashtagsInText(post),
    numOfComments: getNumberOfCommentsForPost(allPosts, post)
  }))

  /** @type { post[] } allPosts */
  var postsWithPostedByPopulated = await UserModel.populate(allPosts, { path: 'retweetData.postedBy' });
  postsWithPostedByPopulated = await UserModel.populate(postsWithPostedByPopulated, { path: 'replyTo.postedBy' });
  postsWithPostedByPopulated = postsWithPostedByPopulated.map(post => fillPostAdditionalFields(post, allPosts));

  return postsWithPostedByPopulated;
}

/** @returns post[] */
PostSchema.statics.findAllUserPosts = async (userId, filterTab = false) => {

  /** @type { post[] } allPosts */
  const allPosts = await PostModel
    .find()
    .sort({ "createdAt": "-1" })
    .lean();

  /** @type { post[] } allPosts */
  var allPostsWithPopulatedPostedBy = await UserModel.populate(allPosts, { path: 'retweetData.postedBy' });

  allPostsWithPopulatedPostedBy = allPostsWithPopulatedPostedBy.filter(post => filterPostsForSelectedTab(post, filterTab, userId))

  const allPostsWithFromNow = allPostsWithPopulatedPostedBy.map(post => fillPostAdditionalFields(post, allPosts));
  return allPostsWithFromNow;
}

/** @returns post */
PostSchema.statics.getPostWithID = async (_id) => {
  /** @type { post } */
  let post = await PostModel.findById(_id)
    .populate('postedBy')
    .populate('retweetUsers')
    .lean()
    .catch(err => {
      console.error(err);
    })

  post = {
    ...post,
    content: colorHashtagsInText(post)
  }

  post.time = moment(post.createdAt).format("H:m A")
  post.date = moment(post.createdAt).format("MMM D, YYYY")

  return post;
}

/** @returns post */
PostSchema.statics.getRepliesForPost = async (_id) => {
  /** @type { Array.<post> } */
  const replies = await PostModel.find({ replyTo: _id })
    .populate('likes')
    .populate('retweetUsers')
    .lean()
    .catch(err => {
      console.error(err);
    });

  const repliesWithFromNow = replies.map(p => ({ ...p, fromNow: moment(p.createdAt).fromNow() }))

  return repliesWithFromNow;
}

PostSchema.statics.getPinnedPostForUserID = async (userId, allPosts) => {
  const post = await PostModel
    .findOne({ postedBy: userId, pinned: true })
    .populate('postedBy')
    .lean()

  return fillPostAdditionalFields(post, allPosts)
}

const PostModel = mongoose.model("Post", PostSchema)
module.exports = PostModel