require('./../typedefs')
const moment = require('moment');
const jwt = require('jsonwebtoken')

function filterPostsForSelectedTab(post, filterTab, userId) {
  if (!filterTab) {
    if (String(post.postedBy._id) == userId && !post.replyTo) {
      return true
    }
  } else {
    if (filterTab == 'posts') {
      if (String(post.postedBy._id) == userId && !post.replyTo) {
        return true
      }
    }

    if (filterTab == 'likes') {
      return post.likes.map(like => String(like)).includes(String(userId));
    }

    if (filterTab == 'replies') {
      if (String(post.postedBy._id) == userId && post.replyTo) {
        return true
      }
    }
  }

  return false
}
/**
 * @param {Array.<post>} allPosts 
 * @param {post} post 
 * @returns { number }
 */
function getNumberOfCommentsForPost(allPosts, post) {
  return allPosts.filter(p => post._id.toString() == p.replyTo?._id.toString()).length
}
/**
 * Adds fromNow and numOfComments properties to post depending on its type
 * @param {post} post 
 * @param {Array.<post>} allPosts 
 * @returns {post}
 */
function fillPostAdditionalFields(post, allPosts) {
  if (post && allPosts) {
    const contentWithHashtags = colorHashtagsInText(post)

    if (post.retweetData) {
      return {
        ...post,
        content: contentWithHashtags,
        fromNow: moment(post.createdAt).fromNow(),
        retweetData: {
          ...post.retweetData,
          fromNow: moment(post.retweetData.createdAt).fromNow(),
          numOfComments: getNumberOfCommentsForPost(allPosts, post.retweetData)
        },
      }
    } else {
      if (post.replyTo) {
        return {
          ...post,
          content: contentWithHashtags,
          replyTo: {
            ...post.replyTo,
            fromNow: moment(post.replyTo.createdAt).fromNow(),
            numOfComments: getNumberOfCommentsForPost(allPosts, post.replyTo)
          },
          fromNow: moment(post.createdAt).fromNow(),
          numOfComments: getNumberOfCommentsForPost(allPosts, post)
        }
      }
      else {
        return {
          ...post,
          content: contentWithHashtags,
          fromNow: moment(post.createdAt).fromNow(),
          numOfComments: getNumberOfCommentsForPost(allPosts, post)
        }
      }
    }

  }
}
/**
 * Creates jwt token used in all routes and in main.liquid
 * @param {user} user 
 */
function createUserJWT(user) {
  return jwt.sign(user, process.env.SECRET_KEY)
}

function createHashtag(text) {
  var repl = text.replace(/#(\w+)/g, '<span class="text-brand-blue pointer-events-none">#$1</span>');
  return repl;
}

function colorHashtagsInText(post) {
  if (!post.content) {
    return "";
  }
  const contentArr = post.content.split(" ");
  const hashtags = contentArr.filter(v => v.startsWith('#'))
  return contentArr.map(txt => hashtags.includes(txt) ? createHashtag(txt) : txt).join(" ");
}

module.exports = {
  filterPostsForSelectedTab,
  getNumberOfCommentsForPost,
  createUserJWT,
  colorHashtagsInText,
  fillPostAdditionalFields
}