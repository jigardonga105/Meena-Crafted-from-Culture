const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courierAgentsSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'courierAgent' },
    image: [{ img: { type: String, required: true } }],
    address: { type: [Object] },
    state: { type: String, required: true, unique: true }
}, { timestamps: true })

module.exports = mongoose.model('courierAgents', courierAgentsSchema)