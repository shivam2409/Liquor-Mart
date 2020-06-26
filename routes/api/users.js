const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route POST api/users
// @desc Register Route
// @access Public

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please enter valid Email').isEmail(),
    check('password', 'Enter password with 6 or more charactor').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //Check if user exists or not
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already Exist' }] });
      }
      user = new User({
        name,
        email,
        password,
      });

      //Password Encryption
      const salt = await bcrypt.genSalt(10);

      //To create hash code It takes plane text and salt text-pass
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const profileFields = {};
      profileFields.user = user.id;

      //Create New Profile
      profile = new Profile(profileFields);
      await profile.save();

      //Return jsonWebtoken
      //Getting userId
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (error, token) => {
          if (error) throw error;
          res.send(token);
        }
      );
      //   res.send('User registerd');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
