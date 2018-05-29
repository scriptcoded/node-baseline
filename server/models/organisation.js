const mongoose = require('mongoose')
const Schema = mongoose.Schema

let organisationSchema = new Schema({
  name: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
})

organisationSchema.methods.toJson = function () {
  return {
    id: this._id,
    name: this.name,
  }
}

module.exports = mongoose.model('Organisation', organisationSchema)
