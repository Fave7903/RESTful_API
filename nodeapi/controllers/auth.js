const jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')
const dotenv = require('dotenv')
const User = require('../models/user')
dotenv.config()
exports.signup = async (req, res) => {
  const userExists = await User.findOne({email: req.body.email})
  if (userExists) 
    return res.status(403).json({
      error: "Email is taken"
  });
  const user = await new User(req.body)
  await user.save()
  res.status(200).json({ message: "Signup success! Please login." })
}

exports.signin = (req, res) => {
  const {email, password} = req.body
  User.findOne({email}, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup."
      })
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match."
      })
    }
    const token = jwt.sign({_id: user.id}, process.env.JWT_SECRET)
    res.cookie('t', token, {expire: new Date() + 9999})
    const {_id, name, email} = user
    return res.json({token, user: { _id, email, name } })
  })
}

exports.signout = (req, res) => {
  res.clearCookie('t')
  return res.json({message: "Signout success!"})
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], 
  userProperty: "auth",
});