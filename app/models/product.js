const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    stock: { type: Boolean, required: true, default: true },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    image: [{ img: { type: String } }],
    name: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    vote: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    extraDiscount: { type: Number, default: 0 },
    offer: { type: [Object] },
    Warr_Garr: { type: [Object] },
    size: { type: [String] },
    color: { type: [String] },
    highlight: { type: [String] },
    payment_ops: { type: [String], required: true },
    service: { type: [String] },
    desc: { type: String, required: true },
    specification: { type: [Object] }
})

module.exports = mongoose.model('Product', productSchema)