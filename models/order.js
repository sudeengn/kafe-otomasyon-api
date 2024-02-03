const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true,
    }],
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Order', orderSchema);