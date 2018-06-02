module.exports = {
  tosVersion: '1.0',
  timezone: 'Europe/Stockholm',
  logsDir: './server/logs/gdpr',

  email: {
    /**
     * - {0}: User email
     * - {1}: Verification token
     */
    activationLink: `http://${req.headers.host}/activate/{0}/{1}`,

    /**
     * - {0}: User email
     * - {1}: Reset token
     */
    resetPasswordLink: `http://${req.headers.host}/reset/{0}/{1}`,
  }
}