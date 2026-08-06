const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  createdAt: { type: Date, default: Date.now },
  fullName:{ type: String,required:true},
  phoneNumber:{ type: String},
  location:{ type: String},
  bio:{type:String},
  avatar:{type:String}
});


module.exports = mongoose.model('User', userSchema);
