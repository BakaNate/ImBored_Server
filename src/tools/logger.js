/**
 ** Developed by Xcrowzz
 ** On 01/08/2019
 ** For project poc_newsletters
 ** Copyright (c) 2018-2019. All rights reserved.
 */

const { Xlog } = require('./Xlog');


exports.myLogger = (req, res, next) => {
  const { method } = req.method;
  const { url } = req;
  const userId = (req.userId) ? req.userId : '';
  const body = (req.body) ? req.body : '';
  const ip = (req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'] : ''; // Requested into nginx conf.d /!\

  Xlog('+++++++++++++++++++++++++++++++++++++++++++++++', 'INF');
  Xlog(`${method} ${url}`, 'INF');
  if (userId) Xlog(`userId: ${userId}`, 'INF');
  if (ip) Xlog(`IP: ${ip}`, 'INF');
  if (body) Xlog(`Body: ${JSON.stringify(body)}`, 'INF');
  next();
};
