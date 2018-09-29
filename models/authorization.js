const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const AuthorizationSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true },
    facebookID: { type: String, unique: true },
  },
  { timestamps: true },
);

AuthorizationSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 8);
    next();
  } catch (error) {
    next(error);
  }
});

AuthorizationSchema.methods.comparePassword = async function comparePassword(password) {
  try {
    const isCorrectPassword = await bcrypt.compare(password, this.password);
    return isCorrectPassword;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = AuthorizationSchema;
