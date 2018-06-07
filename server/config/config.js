module.exports = {
  tosVersion: '1.0',
  timezone: 'Europe/Stockholm',
  logsDir: './server/logs/gdpr',

  email: {
    /**
     * - %1$s: req.readers.host
     * - %2$s: User email
     * - %3$s: Verification token
     */
    activationLink: `http://%1$s/activate/%2$s/%3$s`,

    /**
     * - %1$s: req.readers.host
     * - %2$s: User email
     * - %3$s: Reset token
     */
    resetPasswordLink: `http://%1$s/reset/%2$s/%3$s`
  }
}
