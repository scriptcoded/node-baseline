const fs = require('fs')
const path = require('path')

const mailer = require('../config/nodemailer')

/**
 * Retrieves an email template and fills in placeholders.
 * 
 * @param {string} template Path to template realtive to email directory, without extension
 * @param {Object} variables Variables to pass to the template
 */
module.exports.getTemplate = (template, variables = {}) => {
  return new Promise((resolve, reject) => {
    const basePath = './email/templates'
    const extension = '.html'

    let templatePath = path.resolve(path.join(basePath, template) + extension)

    fs.readFile(templatePath, 'utf8', (err, data) => {
      if (err) { return reject(err) }

      let message = data

      for (var key in variables) {
        message = message.replace(new RegExp(`{{${key}}}`, 'g'), variables[key])
      }

      resolve(message)
    })
  })
}

/**
 * Sends an activation email
 * 
 * @param {*} user 
 * @param {*} activateLink 
 */
module.exports.sendActivationEmail = (user, activateLink) => {
  return new Promise((resolve, reject) => {
    module.exports.getTemplate('email/activate', {
      name: user.name.givenName,
      resetLink: activateLink,
      contactEmail: 'test@example.se',
      contactWebsite: 'https://example.com/',
      contactWebsitePretty: 'example.com',
    }).then(message => {
      var mailOptions = {
        to: user.email,
        subject: 'Test aktivera email',
        html: message,
      }
      mailer.transporter.sendMail(mailOptions, function (err) {
        if (err) { return reject(err) }

        resolve()
      })
    }).catch(err => {
      reject(err)
    })
  })
}