const User = require('../models/UserModel');
const Xres = require('../tools/XresHandler');

function registerUser(req, res) {
  User.createUser(req.body.userEmail, req.body.userPswd, (err, result) => {
    if (err) return Xres.throwIntServerError(err, res);
    console.log(req.body);
    return Xres.sendOKWithData({ info: result }, res);
  });
}

function logUser(req, res) {
  User.fetchUser(req.body.userEmail, req.body.userPswd, (err, result) => {
    if (err) return Xres.throwIntServerError(err, res);
    return Xres.sendOKWithData({ auth: true, token: result }, res);
  });
}

module.exports = {
  logUser,
  registerUser,
};
