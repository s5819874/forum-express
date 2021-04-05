const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: [Category] })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r.dataValues,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name,
          image: r.image
        }))
        return data
      })
      .then(data => { return res.render('restaurants', { restaurants: data }) })
  }
}

module.exports = restController