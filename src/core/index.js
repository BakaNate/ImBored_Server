const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet = require('helmet');
const Ddos = require('ddos');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

// Tools
const { Xlog } = require('../tools/Xlog');
const logger = require('../tools/logger');

const port = (process.env.BUILD_ENVIRONMENT === 'PRODUCTION') ? 3000 : 3080;
const mongooseUri = (process.env.BUILD_ENVIRONMENT === 'PRODUCTION') ? 'mongodb://localhost:27017/imBored' : 'mongodb://localhost:27017/imBored-dev';


const userController = require('../controllers/userController');
const authController = require('../controllers/Auth');

console.time('[*] Booting');

const app = express();
const server = http.createServer(app);

function configRouter() {
  const router = express.Router();
  const ddos = new Ddos({ burst: 5, limit: 10 });
  router.use(ddos.express);

  router.route('/')
    .get(logger.myLogger, (req, res) => { res.status(200).send('Salam !'); });

  router.route('/register')
    .post(logger.myLogger, userController.registerUser);

  router.route('/login')
    .post(logger.myLogger, userController.logUser);

  router.route('/admin')
    .get(logger.myLogger, authController.isAuthenticated);

  app.use(router);
}

function configApp(theapp) {
  theapp.use(cors((req, next) => {
    const options = {
      origin: '*',
      optionsSuccessStatus: 200,
    };
    next(null, options);
  }));

  app.use(helmet());
  app.use((req, res, next) => { // Overrides some of Helmet's properties
    res.header('Content-Security-Policy', 'default-src \'self\''); // Added layer to prevent from injections (See: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP to write the appropriate policy)
    res.header('X-Frame-Options', 'SAMEORIGIN'); // ClickJacking/ClickBaiting Protection
    res.header('X-XSS-Protection', '1; mode=block'); // XSS Protection (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)
    res.header('X-Content-Type-Options', 'nosniff'); // No-Sniffing Content-Type
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH'); // General Allowed Methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, x-access-token, Accept'); // Access Control Exhaustive List
    res.header('x-powered-by', 'BakaNate'); // Anti stack disclose
    next();
  });

  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
  app.use(passport.initialize());

  configRouter(app);
}

function initMongoConnect() {
  mongoose.Promise = global.Promise;
  mongoose.connect(mongooseUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
  }).then(() => {
    Xlog('Successfully connected to the mongoDB server', 'INF');
  }).catch((err) => {
    Xlog(err, 'ERR');
  });
}

initMongoConnect();
configApp(app);

server.listen(port, () => {
  Xlog('ImBored server', 'INF');
  Xlog('Written by BakaNate', 'INF');
  Xlog('For Epitech', 'INF');
  Xlog('Before running the app, consider \'npm audit\' && \'snyk test\' to check for any vulnerabilities', 'INF');
  Xlog('Moreover, have a look at : https://www.npmjs.com/advisories\n\n', 'INF');
  Xlog(`REST API listening at: ${server.address().address}:${server.address().port}`, 'INF');
  Xlog(`Mongoose URI: ${mongooseUri}`, 'INF');

  console.timeEnd('[*] Booting');

  process.on('SIGINT', () => {
    Xlog('\n\n So long, and thanks for all the fish !\n\r');
    process.exit(0);
  });
});
