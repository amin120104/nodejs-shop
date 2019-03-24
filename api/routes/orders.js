const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');


router.get('/', (req, res) => {
    Order.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product : req.body.productId
    });
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:productId', (req, res) => {
    res.status(200).json({
        message: "patch orders"
    })
});

router.delete('/:productId', (req, res) => {
    res.status(200).json({
        message: "delete orders"
    })
});

module.exports = router;

