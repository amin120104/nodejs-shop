const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
        // We can use here just -__v to avoid this
        .select('-__v')
        .exec()
        .then(docs => {
            console.log(docs);
            if (docs.length > 0) {
                const response = {
                    message: `total ${docs.length} users found`,
                    users: docs.map(item => {
                        return {
                            _id: item._id,
                            email: item.email,
                            password: item.password,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/user/' + item._id
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "User List is Empty"
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

router.post('/signup', (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            })
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });

            user.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: "new user has been created",
                    user: result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        }
    })
})

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            console.log(user);
            if(user.length < 1) {
                return res.status(401).json({message: 'Auth failed'});
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    return res.status(401).json({message: 'Auth failed'});
                }
                if(result) {

                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: 'Auth sucessful',
                        token: token
                    });
                }
                res.status(401).json({message: 'Auth failed'});
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json('User Id is not found');
            } else {
                return User.deleteOne({ _id: id })
                    .then(user => {
                        console.log(user);
                        res.status(200).json({
                            message: 'user has been deleted',
                            request: {
                                type: 'POST',
                                url: 'http://localhost:3000/user/signup',
                                body: { email: 'String', password: 'String' }
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