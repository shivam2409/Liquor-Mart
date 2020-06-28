const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Product = require('../../models/Product');

//@route    Post api/product
//@desc     Add Product
//@access   Private

router.post(
  '/',
  [
    auth[
      (check('name', 'require name').notEmpty(),
      check('image', 'require img').notEmpty(),
      check('price', 'require price').notEmpty(),
      check('size', 'require size').notEmpty(),
      check('percentage', 'require %').notEmpty(),
      check('type', 'require type').notEmpty())
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //   const prod = await Product.findById(req.prod.id);
      const newProduct = new Product({
        name: req.name,
        image: req.image,
        price: req.price,
        size: req.size,
        percentage: req.percentage,
        type: req.type,
      });
      const product = await newProduct.save();
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    GET api/product
//@desc     GET all Product
//@access   Public

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
