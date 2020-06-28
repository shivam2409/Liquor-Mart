const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Product = require('../../models/Product');
const { post } = require('./profile');

//@route    Post api/product
//@desc     Add Product
//@access   Private

router.post(
  '/',
  [
    auth,
    [
      (check('name', 'require name').notEmpty(),
      check('image', 'require img').notEmpty(),
      check('price', 'require price').notEmpty(),
      check('size', 'require size').notEmpty(),
      check('percentage', 'require %').notEmpty(),
      check('type', 'require type').notEmpty()),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, image, proce, size, percentage, type } = req.body;
      //   const prod = await Product.findById(req.prod.id);
      const newProduct = new Product({
        name,
        image,
        price,
        size,
        percentage,
        type,
      });
      const product = await newProduct.save();
      res.json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route    DELETE api/product/:id
//@desc     delete Product
//@access   Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product Not Found' });
    }
    //check on Author/admin

    await product.remove();
    res.json({ msg: 'Product removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product Not Found' });
    }
    res.status(500).send('Server Error');
  }
});

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

//@route    GET api/products/:id
//@desc     GET Product by id
//@access   Private

router.get('/:id', async (req, res) => {
  try {
    //MAde this User can find from entering name
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not Found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
