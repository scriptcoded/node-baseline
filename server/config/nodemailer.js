const nodemailer = require('nodemailer')

/**
 * Set up nodemailer for sending email. Using
 * Ethereal.mail for testing purposes.
 */
module.exports.transporter = nodemailer.createTransport(
  {
    host: 'imap.ethereal.email',
    port: 587,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  },
  {
    from: `Test <${process.env.NODEMAILER_USER}>`
  }
)
