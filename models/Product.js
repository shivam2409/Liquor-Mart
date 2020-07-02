const mongoose = require('mongoose');

//Product schema

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  percentage: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },

  //Avalibility
});

module.exports = mongoose.model('Product', ProductSchema);
