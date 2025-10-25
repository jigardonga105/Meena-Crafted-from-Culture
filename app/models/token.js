const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    token: { type: String, required: true },
    for: { type: String, required: true, default: 'resetPassword' },
    accId: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Token', tokenSchema)