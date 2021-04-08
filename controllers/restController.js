const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (Number(req.query.page) - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: [Category],
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
      .then(restaurants => {
        //page settings
        const page = Number(req.query.page) || 1
        const maxPage = Math.ceil(restaurants.count / pageLimit)
        const pageList = Array.from({ length: maxPage }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > maxPage ? maxPage : page + 1

        const data = restaurants.rows.map(r => ({
          ...r.dataValues,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name,
          image: r.image
        }))
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId,
              page,
              pageList,
              prev,
              next
            })
          })
      })
      .catch(err => res.send(err))
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        console.log(restaurant)
        return res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => res.send(err))
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    })
      .then(restaurants => {
        Comment.findAll({
          raw: true,
          nest: true,
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
        })
          .then(comments => {
            res.render('feeds', {
              comments,
              restaurants
            })
          })
      })
  }
}

module.exports = restController