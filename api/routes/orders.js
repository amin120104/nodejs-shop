const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: "get orders"
    })
});

router.post('/', (req, res) => {
    res.status(201).json({
        message: "post orders"
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

