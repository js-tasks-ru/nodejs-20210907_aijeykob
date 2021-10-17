const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});
  const data = categories.map((el) => ({
    id: el.id,
    title: el.title,
    subcategories: el.subcategories.map((subcategories) => ({
      id: subcategories.id,
      title: subcategories.title,
    })),
  }),
  );
  ctx.body = {categories: data};
};
