const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        callback({ restaurants })
      })
      .catch(err => res.send(err))
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        callback({ restaurant: restaurant.toJSON() })
      })
      .catch(err => res.send(err))
  },
  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      callback({ status: 'error', message: '請填寫名稱' })
      //req.flash('warning_msg', '請填寫名稱')
      //return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)

        return Restaurant.create({
          name, tel, address, opening_hours, description,
          image: file ? img.data.link : null, CategoryId: req.body.categoryId
        })
          .then(restaurant => {
            callback({ status: 'success', message: 'restaurant was successfully created' })
            // req.flash('success_msg', 'restaurant was successfully created')
            // res.redirect('/admin/restaurants')
          })
          .catch(err => res.send(err))

      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
        image: file ? `/upload/${file.originalname}` : null,
        CategoryId: req.body.categoryId
      })
        .then(restaurant => {
          callback({ status: 'success', message: 'restaurant was successfully created' })
          // req.flash('success_msg', 'restaurant was successfully created')
          // res.redirect('/admin/restaurants')
        })
        .catch(err => res.send(err))
    }
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(() => res.json({ status: 'success', message: '' }))
      })
  }
}

module.exports = adminService