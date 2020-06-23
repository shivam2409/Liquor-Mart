const mongoose = require('mongoose');
const { model } = require('./User');

//Profile schema

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  favItem: [
    {
      type: String,
      unique: true,
    },
  ],
  address: [
    {
      apartment: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postal: {
        type: String,
        required: true,
      },
    },
  ],
  paymentMethod: {
    creditcard: [
      {
        number: {
          type: String,
        },
        cvv: {
          type: String,
        },
        name: {
          type: String,
        },
        date: {
          type: String,
        },
      },
    ],

    debitCard: [
      {
        number: {
          type: String,
        },
        cvv: {
          type: String,
        },
        name: {
          type: String,
        },
        date: {
          type: String,
        },
      },
    ],
  },
});

module.exports = mongoose.model('Porfile', ProfileSchema);
