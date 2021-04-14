const db = require('../../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const categoryService = require('../../services/categoryService')

let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = categoryController