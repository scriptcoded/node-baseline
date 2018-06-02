const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Schema for GDPR logs
 */
var gdprLogSchema = new mongoose.Schema({
  user: Object,
  location: String,
  error: Object,
  caller: String,
  ip: String,
  session: String,
  msg: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('GDPRLog', gdprLogSchema);