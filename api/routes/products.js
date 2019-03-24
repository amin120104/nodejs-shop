const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); //: is not read by windows
    }
  });

//setup supported file type
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
    // cb(new Error('I don\'t have a clue!'));
}

   
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
 });

const Product = require('./../models/product');


router.get('/', (req, res, next) => {
    Product.find()
        // We can use here just -__v to avoid this
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length > 0) {
                const response = {
                    message: `total ${docs.length} product found`,
                    products: docs.map(item => {
                        return {
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            productImage: item.productImage,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + item._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "Your Product List is Empty"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("from database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No data found againist the ID"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            })
        })
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    // console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created new Products successfully",
                createProduct: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            })
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findById(id)
        .exec()
        .then(result => {
            if(!result) {
                return res.status(404).json('Product Id is not found / it is invalid');
            } else {
                return Product.updateOne({ _id: id }, { $set: updateOps })
                    .then(product => {
                        res.status(200).json({
                            message: 'Product updated',
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + id
                            }
                        });
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json('Product Id is not found');
            } else {
                return Product.deleteOne({ _id: id })
                    .then(product => {
                        console.log(product);
                        res.status(200).json({
                            message: 'product has been deleted',
                            request: {
                                type: 'POST',
                                url: 'http://localhost:3000/products',
                                body: { name: 'String', price: 'Number' }
                            }
                        })
                    })
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;

