const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

//db connection here useNewUrlParser or maybe it will be useNewUrlParser or useMongoClient
mongoose.connect('mongodb+srv://ura-shop:' + process.env.mongo_atlas_PW + '@ura-shop-7vpyn.mongodb.net/test?retryWrites=true', {useNewUrlParser: true, useCreateIndex: true})
    .then(() => console.log('connected to Database'))
    .catch(err => console.log(`Database connection error. ${err} `));
mongoose.Promise = global.Promise;

//all route include from api/routes/ directory
const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

//default setup
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

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