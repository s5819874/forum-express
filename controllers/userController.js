const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      req.flash('warning_msg', '兩次密碼輸入不同！')
      return res.render('signup', { name, email, password, passwordCheck })
    } else {
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('warning_msg', '此信箱已註冊！')
            return res.render('signup', { name, email, password, passwordCheck })
          } else {
            User.create({
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_msg', '註冊成功，請登入！')
                return res.redirect('/signin')
              })
          }
        })
        .catch(err => res.send(err))
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_msg', '登入成功！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        res.render('profile', { user: user.toJSON() })
      })
      .catch(err => res.send(err))
  },
  editUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        res.render('editProfile', { user: user.toJSON() })
      })
      .catch(err => res.send(err))
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "名字不見了?")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)

        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              image: img.data.link
            })
              .then((user) => {
                req.flash('success_msg', 'Your profile was successfully updated')
                res.redirect(`/users/${user.id}`)
              })
          })
          .catch(err => res.send(err))
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            email: req.body.email,
          })
            .then(user => {
              req.flash('success_msg', 'Your profile was successfully updated')
              res.redirect(`/users/${user.id}`)
            })
        })
        .catch(err => res.send(err))
    }
  }
}

module.exports = userController