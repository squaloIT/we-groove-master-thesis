const mongoose = require('mongoose');
require('./../../typedefs')

const HashtagSchema = new mongoose.Schema({
  hashtag: { type: String, trim: true, unique: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  postsLength: { type: Number }
}, { timestamps: true });

HashtagSchema.pre('findOne', function (next) {
  this.populate('posts')
  next()
});

HashtagSchema.statics.createHashTagsForPost = async function (post) {
  const hashtags = post.content.split(" ").filter(v => v.startsWith('#'))
  //TODO - skinuti duplikate prilikom dodavanja. Ostavicu ovako zbog testiranja 

  hashtags.forEach(async hashtag => {
    const existingHashtag = await HashtagModel.findOne({ hashtag });

    if (existingHashtag) {
      existingHashtag.posts = [...existingHashtag.posts, post._id];
      existingHashtag.postsLength += 1;
      await existingHashtag.save();
    } else {
      var newHashtag = new HashtagModel({
        hashtag,
        posts: [post._id],
        postsLength: 1
      })
      await newHashtag.save()
    }
  });
}

HashtagSchema.statics.getMostPopularHashtags = async function () {
  const result = await HashtagModel.find({}).sort({ "postsLength": -1 }).limit(5).exec()
  return result;
}

HashtagSchema.statics.getHashtagsForSearch = async function (searchTerm) {
  let hashtag = searchTerm.startsWith("#") ? searchTerm : "#" + searchTerm;

  const result = await HashtagModel.find({ hashtag: { $regex: hashtag, $options: "i" } })
  return result;
}

HashtagSchema.statics.getHashtagWithPosts = async function (hashId) {
  const result = await HashtagModel.findById(hashId).lean()
  return result;
}

const HashtagModel = mongoose.model("Hashtag", HashtagSchema)
module.exports = HashtagModel