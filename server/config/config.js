module.exports = {
  tosVersion: '1.0',
  timezone: 'Europe/Stockholm',
  logsDir: './server/logs/gdpr',

  email: {
    /**
     * - {0}: req.readers.host
     * - {1}: User email
     * - {2}: Verification token
     */
    activationLink: `http://{0}/activate/{1}/{2}`,

    /**
     * - {0}: req.readers.host
     * - {1}: User email
     * - {2}: Reset token
     */
    resetPasswordLink: `http://{0}/reset/{1}/{2}`
  }
}
