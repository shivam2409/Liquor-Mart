const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
//@route GET api/auth
//@desc test route
//@access Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route GET api/auth
//@desc test route
//@access Public

router.post(
  '/',
  [
    check('email', 'Please include Valid email adress').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //check if user exists
      //USING FINDONE function
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'invalid credentials' }] });
      }
      //return jsonwebtoken
      //getting userId
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );

      //   res.send('User Registerd');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
