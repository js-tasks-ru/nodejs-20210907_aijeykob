const Product = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (!subcategory) return next();
  const products = await Product.find({subcategory});

  const data = products.map((el) => ({
    id: el.id,
    title: el.title,
    description: el.description,
    price: el.price,
    category: el.category,
    subcategory: el.subcategory,
    images: el.images,
  }),
  );
  ctx.body = {products: data};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({});

  const data = products.map((el) => ({
    id: el.id,
    title: el.title,
    description: el.description,
    price: el.price,
    category: el.category,
    subcategory: el.subcategory,
    images: el.images,
  }),
  );
  ctx.body = {products: data};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  const invalidId = !ObjectId.isValid(id);
  if (invalidId) ctx.throw(400, 'Invalid id');

  const product = await Product.findById(id);
  if (!product) ctx.throw(404, 'Not Found');
  const data = ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    subcategory: product.subcategory,
    images: product.images,
  });
  ctx.body = {product: data};
};

