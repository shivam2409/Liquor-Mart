const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const Profile = require('../../models/Profile');
const { validationResult } = require('express-validator');
const User = require('../../models/User');

//@route    POST api/profile/me
//@desc     Create or update user profile
//@access   Private

router.post('/', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    favItem,
    apartment,
    street,
    city,
    province,
    postal,
    cardNumber,
    cvv,
    nameOnCard,
    date,
  } = req.body;

  //Build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  // if (favItem) profileFields.favItem = favItem;

  //Build Address object
  // profileFields.address = {};
  // if (apartment) profileFields.address.apartment = apartment;
  // if (street) profileFields.address.street = street;
  // if (city) profileFields.address.city = city;
  // if (province) profileFields.address.province = province;
  // if (postal) profileFields.address.postal = postal;

  // //Build Payment method
  // profileFields.paymentmethod = {};
  // if (cardNumber) profileFields.paymentmethod.cardNumber = cardNumber;
  // if (cvv) profileFields.paymentmethod.cvv = cvv;
  // if (nameOnCard) profileFields.paymentmethod.nameOnCard = nameOnCard;
  // if (date) profileFields.paymentmethod.date = date;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      //update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }
    //Create New Profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//Changes needed in structure

//@route    GET api/profile/me
//@desc     Get current users Profile
//@access   Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no Profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    DELETE api/profile
//@desc     DELETE Profile user
//@access   Private

router.delete('/', auth, async (req, res) => {
  try {
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
