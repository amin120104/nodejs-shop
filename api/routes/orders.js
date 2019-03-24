const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('./../models/product');


router.get('/', (req, res, next) => {
    Order.find()
        .select('-__v')
        .exec()
        .then(docs => {
            res.status(201).json({
                message: `Total ${docs.length} orders found`,
                orders: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

//here also an use when valid object is pass but that are not in database
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(docs => {
            if(docs) {
                res.status(201).json({
                    message: 'order found',
                    orders: docs,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    }
                });
            } else {
                res.status(404).json({
                    message: "No Order found againist the ID"
                })
            }
            
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});


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
    Order.remove({ _id: id })
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

