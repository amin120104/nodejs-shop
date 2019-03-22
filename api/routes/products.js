const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).json({
        message: "get products"
    })
});

router.post('/', (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: "Created new Products successfully",
        createProduct: product
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

