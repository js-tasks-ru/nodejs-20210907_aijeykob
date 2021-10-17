const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  const data = await Product.find({$text: {$search: query}});
  console.log('data', data);
  ctx.body = {products: data};
};
