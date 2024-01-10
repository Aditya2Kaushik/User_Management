const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: {
    type: Number,
    unique: true,
  },
  name: String,
  lastName: String,
  age: Number,
  location: String,
  interests: String,
  income: Number
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const lastUser = await this.constructor.findOne({}, {}, { sort: { 'userID': -1 } });
      if (lastUser) {
        this.userID = lastUser.userID + 1;
      } else {
        this.userID = 1;
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
