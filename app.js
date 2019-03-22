const express = require('express');
const app = express();
const morgan = require('morgan');

//all route include from api/routes/ directory
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
//all routes uses here
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

//error handler for all route(this is failed when db integrated)
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

//for db and all
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;