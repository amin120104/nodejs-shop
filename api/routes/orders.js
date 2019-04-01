const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//all schema
const Order = require('../models/order');
const Product = require('./../models/product');

//all controller
const OrderController = require('../controllers/orders');

router.get('/', OrderController.orders_get_all);

//here also an use when valid object is pass but that are not in database
router.get('/:orderId', OrderController.orders_get_single);


//here have an issue
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: "product not found" });
            } else {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
                return order.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Order stored',
                            Order: result
                        });
                    })
            }

        })
        .catch(err => {
            res.status(500).json({
                message: 'product not ordered',
                error: err.message
            });
        });
});

router.patch('/:orderId', (req, res) => {
    res.status(200).json({
        message: "patch orders"
    })
});

router.delete('/:orderId', (req, res) => {
    const id = req.params.orderId;
    Order.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'order has been deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'Id', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;

