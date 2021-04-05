const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', { categories })
    })
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('warning_msg', '請輸入名稱')
      return res.redirect('back')
    }
    return Category.create({ name })
      .then(() => res.redirect('/admin/categories'))
  }
}
module.exports = categoryController