const Order = require('../models/order');

//all orders get
exports.orders_get_all =  (req, res, next) => {
    Order.find()
        .populate('product', '-__v')
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
}

//single order
exports.orders_get_single = (req, res, next) => {
    Order.findById(req.params.orderId)
        //here will be details data
        .populate('product', '-__v')
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
}
