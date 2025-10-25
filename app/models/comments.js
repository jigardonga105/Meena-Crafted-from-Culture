const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentsSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    prdID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: [{ img: { type: String, required: true } }],
    rating: { type: Number, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Comments', commentsSchema)