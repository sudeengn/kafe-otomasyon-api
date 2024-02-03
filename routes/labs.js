const express = require('express');
const router = express();

const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Product = require('../models/product');


// Back-end'in Back-end'İ
// router.get('/', async (req, res) => {
//     const orderList = await Order.find()
//     .populate('user' ,'name').sort({'dateOrdered':-1})
//     .populate({ 
//         path: 'orderItems', populate: { 
//             path: 'product', populate: 'category'}
//     });

//     if (!orderList) {
//         res.status(500).json({ success: false })
//     }
//     res.send(orderList)
// });


// router.get('/:id', async (req, res) => {
//     const order = await Order.findById(req.params.id).populate('name', 'user');

//     if (!order) {
//         res.status(500).json({ success: false })
//     }
//     res.send(order)
// });



module.exports = router