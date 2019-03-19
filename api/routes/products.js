const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: "get products"
    })
});

router.post('/', (req, res) => {
    res.status(201).json({
        message: "post products"
    })
});

router.patch('/:productId', (req, res) => {
    res.status(200).json({
        message: "patch products"
    })
});

router.delete('/:productId', (req, res) => {
    res.status(200).json({
        message: "delete products"
    })
});

module.exports = router;

