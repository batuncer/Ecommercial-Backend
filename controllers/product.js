const Product = require("../models/product.js");
const ProductFilter = require("../utils/productFilter.js");
const cloudinary = require("cloudinary").v2;

// Get all products with filtering and pagination
const productsAll = async (req, res) => {
  try {
    const resultPerPage = 5;
    const productFilter = new ProductFilter(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await productFilter.query;
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const adminProducts = async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({ products });
};

const productsDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new product (admins can)
const createProduct = async (req, res, next) => {
  try {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push({ url: req.body.images });
    } else {
      images = req.body.images;
    }

    let allImages = [];
    for (let i = 0; i < images.length; i++) {
      const image = await cloudinary.uploader.upload(images[i].url, {
        folder: "products",
      });
      allImages.push({
        public_id: image.public_id,
        url: image.secure_url,
      });
    }

    req.body.images = allImages;

    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
// Delete a pruduct by ID
const deleteProduct = async (req, res, next) => {
  try {
    //I dont use delete beacuse i want to delete the product with images
    const product = await Product.findById(req.params.id);
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }
    await product.remove();
    res.status(200).json("Item is successfully deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Update a product by ID
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    //if images are diffirent from what we have
    if (images !== undefined) {
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }
    }

    let allImages = [];
    for (let i = 0; i < images.length; i++) {
      const image = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });
      allImages.push({
        public_id: image.public_id,
        url: image.secure_url,
      });
    }

    req.body.images = allImages;
    req.body.user = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a review for a product
const createReview = async (req, res, next) => {
  const { productId, comment, rating } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    comment: comment,
    rating: Number(rating),
  };

  const product = await Product.findById(productId);

  product.reviews.push(review);
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  avg = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ message: "Thank you for your comment" });
};

module.exports = {
  productsAll,
  productsDetails,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts,
  adminProducts,
};
