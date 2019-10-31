const User = require('../models/UserModel');
const Xres = require('../tools/XresHandler');
const utils = require('../tools/validations/userValidate');

async function registerUser(req, res) {
  if (!await utils.userValidate(req.body)) return Xres.throwBadRequest('Wrong parameters', res);
  await User.createUser(req.body.userEmail, req.body.userPswd, (err, result) => {
    if (err) return Xres.throwIntServerError(err, res);
    console.log(req.body);
    return Xres.sendOKWithData({ info: result }, res);
  });
  return null;
}

async function logUser(req, res) {
  if (!await utils.userValidate(req.body)) return Xres.throwBadRequest('Wrong parameters', res);
  await User.fetchUser(req.body.userEmail, req.body.userPswd, (err, result) => {
    if (err) return Xres.throwIntServerError(err, res);
    return Xres.sendOKWithData({ auth: true, token: result }, res);
  });
  return null;
}

module.exports = {
  logUser,
  registerUser,
};
