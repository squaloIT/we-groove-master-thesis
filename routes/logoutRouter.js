const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log(err)
      } else {
        res.clearCookie('rememberMe');
        res.redirect('/login');
      }
    })
  }
})

module.exports = router;