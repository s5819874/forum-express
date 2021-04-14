const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const adminService = require('../services/adminService.js')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('sucess_msg', data.message)
        return res.redirect('/admin/restaurants')
      }
      req.flash('warning_msg', data.message)
      return res.redirect('back')
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        Category.findAll({ raw: true, nest: true })
          .then(categories => {
            return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
          })
      })
      .catch(err => res.send(err))
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success_msg', data.message)
        return res.redirect('/admin/restaurants')
      }
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'sucess') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        const isAdmin = !user.isAdmin
        user.update({ isAdmin })
          .then(() => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect('/admin/users')
          })
      })
  }
}

module.exports = adminController