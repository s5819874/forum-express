const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
      .then(comment => {
        res.redirect(`/restaurants/${req.body.restaurantId}`)
      })
      .catch(err => res.send(err))
  }
}

module.exports = commentController