import jwt from 'jsonwebtoken';
import INTERNAL_SERVOR_ERROR from '../tools/messages/errorMessages';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const secret = 'thisIs4SecretKey@';

const UserSchema = new mongoose.Schema({
  docVersion: {
    type: Number,
    required: true,
    default: 1,
    select: false,
  },
  userEmail: {
    type: String,
    required: true,
    maxLength: 254,
    unique: true,
  },
  userPswd: {
    type: String,
    required: true,
    minLength: 16,
    maxLength: 254,
    select: false,
  },
  userRooms: {
    type: [String],
    maxLength: 254,
  },
});

UserSchema.statics.createUser = async function (userEmail, userPswd, cb) {
  const hashedPswd = await bcrypt.hash(userPswd, 8);
  if (!hashedPswd) return cb(new Error(INTERNAL_SERVOR_ERROR));
  await this.model('User').create({
    userEmail,
    userPswd: hashedPswd,
  }, (err, record) => {
    if (err) return cb(err);
    return cb(null, record);
  });
  return null;
};

UserSchema.statics.fetchUser = async function (userEmail, userPswd, cb) {
  await this.findOne({ userEmail }, async (err, user) => {
    if (err) return cb(err);
    if (!user) return cb(new Error('User not found'));
    const isValid = await bcrypt.compare(userPswd, user.userPswd);
    if (isValid === true) {
      // eslint-disable-next-line no-underscore-dangle
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });
      return cb(null, token);
    }
    return cb(new Error('Invalid Credential'));
  }).select('+userPswd');
};

module.exports = mongoose.model('User', UserSchema);
