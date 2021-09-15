const express = require('express');
const router = express.Router();
const UserModel = require('../../db/schemas/UserSchema');
const HashtagModel = require('./../../db/schemas/HashtagSchema')
require('./../../typedefs');


router.get('/search/:searchTerm', async (req, res) => {
  const searchTerm = req.params.searchTerm;

  Promise.all([
    HashtagModel.getHashtagsForSearch(searchTerm),
    UserModel.getUsersForSearch(searchTerm)
  ]).then(res => {
    /** @type { hashtag[] } */
    const hashtags = res[0]
    /** @type { user[] } */
    const users = res[1]

    return Promise.resolve({ hashtags, users })
  })
    .then(usersAndHashtags => {
      return res.status(200).json({
        data: usersAndHashtags,
        msg: 'Successfull',
        status: 200
      });
    })
    .catch(err => {
      console.error(err)
      return res.status(400).json({
        data: null,
        msg: 'There was problem with getting results based on the search term',
        status: 400
      });
    })


})


module.exports = router;