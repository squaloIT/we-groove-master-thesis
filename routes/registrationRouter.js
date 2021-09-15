const express = require('express')
const router = express.Router();
const userModel = require('../db/schemas/UserSchema')
const bcrypt = require('bcrypt');
require('./../typedefs');

router.get('/', (req, res, next) => {
  res.status(200).render('register', {
    title: "Registration"
  });
})

router.post('/', async (req, res, next) => {
  /** @type { userFromRegistration } user */
  const user = req.body;

  if (user.username && user.password && user.fullName && user.email) {

    try {
      var userWhichAlreadyExists = await userModel.isAlreadyCreated(user.username, user.email)
    } catch (err) {
      res.status(500).render('register', { msg: "Something went wrong while trying to find existing user.", status: 500 });
      return;
    }

    if (userWhichAlreadyExists) {
      if (userWhichAlreadyExists.username == user.username) {
        res.status(400).render('register', { msg: "User with that username already exists.", status: 400 });
        return;
      }
      if (userWhichAlreadyExists.email == user.email) {
        res.status(400).render('register', { msg: "User with that email already exists.", status: 400 });
        return;
      }
    }

    try {
      const hash = await bcrypt.hash(user.password, 8)

      var createdUser = new userModel({
        username: user.username,
        password: hash,
        email: user.email,
        description: user.description,
        fullName: user.fullName
      })
      var crtUser = await createdUser.save();

      if (crtUser) {
        req.session.user = crtUser.getDataForSession()
        return res.redirect('/');
      }
    } catch (err) {
      res.status(500).render('register', { msg: "Something went wrong while trying to create new user.", status: 500 });
      console.log(err)
      return;
    }
  } else {
    res.status(400).render('register', { msg: "Please insert all fields! ", status: 400 })
  }
})
module.exports = router;