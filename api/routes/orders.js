const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: "get orders"
    })
});

router.post('/', (req, res) => {
    const order = {
        productId : req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: "Order was Created",
        order: order

    })
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

