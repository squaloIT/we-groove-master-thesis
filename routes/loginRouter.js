const express = require('express')
const router = express.Router();
const userModel = require('../db/schemas/UserSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

require('./../typedefs');

router.get('/', (req, res, next) => {
  res.status(200).render('login', {
    title: "Login"
  });
})

router.post('/', async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  /** @type { user } user */
  const foundUser = await userModel.findOne({ email });
  if (!foundUser) {
    return res.status(400).render('login', {
      msg: "There is no user with that email or password",
      status: 400,
      email,
      password
    })
  }

  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    return res.status(400).render('login', {
      msg: "There is no user with that username or password",
      status: 400,
      email,
      password
    })
  }

  /** @type { user } user */
  const user = foundUser.getDataForSession()
  req.session.user = user;

  if (rememberMe !== undefined) {
    let options = {
      // maxAge: 1000 * 60 * 10080, // would expire after 7 days
      httpOnly: true, // The cookie only accessible by the web server
      signed: true // Indicates if the cookie should be signed
    }

    const userParams = { email, password };
    const rememberMeTokenData = jwt.sign(userParams, process.env.SECRET_KEY, { expiresIn: "7d" });

    res.cookie('rememberMe', rememberMeTokenData, {
      ...options,
      expires: moment().add(7, 'days').toDate()
    })
  }

  return res.redirect('/');
})

module.exports = router;