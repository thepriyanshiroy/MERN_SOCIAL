import User from '../models/user.model'
import extend from 'lodash/extend'
import errorHandler from './../helpers/dbErrorHandler'
import formidable from 'formidable'
import fs from 'fs'
import profileImage from './../../client/assets/images/profile-pic.png'

const create = async (req, res) => {
  if (req.body && req.body.email) {
    req.body.email = req.body.email.trim().toLowerCase()
    try {
      const existingUser = await User.findOne({ email: req.body.email })
      if (existingUser) {
        return res.status(400).json({
          error: "Email already exists"
        })
      }
    } catch (e) {
      // continue to save
    }
  }
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id).populate('following', '_id name')
    .populate('followers', '_id name')
    .exec()
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })

    // Auto-clean any self-follow if it ever occurred
    if (user.following && user.following.some(f => String(f._id || f) === String(user._id))) {
      await User.findByIdAndUpdate(user._id, { $pull: { following: user._id, followers: user._id } })
      user.following = user.following.filter(f => String(f._id || f) !== String(user._id))
      user.followers = user.followers.filter(f => String(f._id || f) !== String(user._id))
    }

    req.profile = user
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  let userObj = req.profile.toObject ? req.profile.toObject() : { ...req.profile }
  userObj.hasPhoto = !!(req.profile.photo && req.profile.photo.data && req.profile.photo.data.length > 0)
  delete userObj.photo
  return res.json(userObj)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      })
    }
    let user = req.profile
    user = extend(user, fields)
    user.updated = Date.now()
    if(files.photo){
      user.photo.data = fs.readFileSync(files.photo.path)
      user.photo.contentType = files.photo.type
    }
    try {
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      let userObj = user.toObject ? user.toObject() : { ...user }
      userObj.hasPhoto = !!(user.photo && user.photo.data && user.photo.data.length > 0)
      delete userObj.photo
      res.json(userObj)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
  })
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const photo = (req, res, next) => {
  if (req.profile.photo && req.profile.photo.data && req.profile.photo.data.length > 0) {
    res.set("Content-Type", req.profile.photo.contentType)
    return res.send(req.profile.photo.data)
  }
  return res.status(404).json({ error: "Photo not found" })
}

const defaultPhoto = (req, res) => {
  return res.sendFile(process.cwd()+profileImage)
}

const addFollowing = async (req, res, next) => {
  if (String(req.body.userId) === String(req.body.followId)) {
    return res.status(400).json({ error: "Cannot follow yourself" })
  }
  try{
    await User.findByIdAndUpdate(req.body.userId, {$addToSet: {following: req.body.followId}}) 
    next()
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const addFollower = async (req, res) => {
  try{
    let result = await User.findByIdAndUpdate(req.body.followId, {$addToSet: {followers: req.body.userId}}, {new: true})
                            .populate('following', '_id name')
                            .populate('followers', '_id name')
                            .exec()
      result.hashed_password = undefined
      result.salt = undefined
      res.json(result)
    }catch(err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }  
}

const removeFollowing = async (req, res, next) => {
  try{
    await User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}) 
    next()
  }catch(err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}
const removeFollower = async (req, res) => {
  try{
    let result = await User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
                            .populate('following', '_id name')
                            .populate('followers', '_id name')
                            .exec() 
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  }catch(err){
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
  }
}

const removeFollowerFromUser = async (req, res) => {
  try {
    const userId = req.body.userId
    const followerId = req.body.followerId
    await User.findByIdAndUpdate(userId, { $pull: { followers: followerId } })
    await User.findByIdAndUpdate(followerId, { $pull: { following: userId } })
    let result = await User.findById(userId)
      .populate('following', '_id name')
      .populate('followers', '_id name')
      .exec()
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const findPeople = async (req, res) => {
  let following = req.profile.following.map(u => (u._id ? u._id : u))
  following.push(req.profile._id)
  try {
    let users = await User.find({
      _id: { $nin : following },
      name: { $ne: req.profile.name }
    }).select('name email')

    const myName = (req.profile.name || '').trim().toLowerCase()
    const myEmail = (req.profile.email || '').trim().toLowerCase()
    users = users.filter(u => {
      const uId = String(u._id)
      if (uId === String(req.profile._id)) return false
      const uName = (u.name || '').trim().toLowerCase()
      if (uName && myName && uName === myName) return false
      const uEmail = (u.email || '').trim().toLowerCase()
      if (uEmail && myEmail && uEmail === myEmail) return false
      return true
    })

    res.json(users)
  }catch(err){
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  removeFollowerFromUser,
  findPeople
}
