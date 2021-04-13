const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')
let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
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
  },
  putCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.update(req.body)
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  }
}
module.exports = categoryController