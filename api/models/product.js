const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 200
    },
    price: {
        type: Number,
        required: true,
        min: 100,
        max: 500
    }
})

module.exports = mongoose.model('Product', productSchema);