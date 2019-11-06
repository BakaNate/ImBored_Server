import nodemailer from 'nodemailer';

const { Xlog } = require('./Xlog');
const Constants = require('./Constants');

const constant = new Constants();

const sendMail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: constant.MAIL,
      pass: constant.MAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  const info = await transporter.sendMail({
    from: constant.MAIL_FROM,
    to: email,
    subject: constant.MAIL_SUBJECT,
    text: constant.MAIL_TEXT,
  });
  Xlog(`Mail sent ${info}`, 'INF');
};

module.exports = {
  sendMail,
};
