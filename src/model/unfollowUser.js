const mongoose = require('../database');

const unfollowUserSchema = new mongoose.Schema({
   name:String,
   email:String,
   password:String,
   phone:Number,
   _enabled:Boolean
});
module.exports = mongoose.model('unfollow_users', unfollowUserSchema);     