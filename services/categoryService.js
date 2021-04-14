const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return callback({ categories, category: category.toJSON() })
          })
      } else {
        return callback({ categories })
      }
    })
  },
  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: '請輸入名稱' })
    }
    return Category.create({ name })
      .then(() =>
        callback({ status: 'success', message: '' })
      )
  },
  putCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.update(req.body)
          .then((category) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = categoryService