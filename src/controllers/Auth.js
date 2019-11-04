import passport from 'passport';
import PassportCustom from 'passport-custom';
import jwt from 'jsonwebtoken';

const secret = 'thisIs4SecretKey@';

passport.use('jwt', new PassportCustom(
  async (req, cb) => {
    const token = req.headers['x-access-token'];
    if (!token) {
      return cb(new Error('Mising token'));
    }
    await jwt.verify(token, secret, (err, decoded) => {
      if (err) return cb(err);
      req.userId = decoded.id;
      return cb(null, req);
    });
    return null;
  },
));

exports.isAuthenticated = passport.authenticate('jwt', {
  session: false,
}, null);
