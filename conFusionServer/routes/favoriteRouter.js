const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('dishes')
            .populate('user')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (null != favorite) {
                    if (null == favorite.dishes || favorite.dishes.length === 0) {
                        favorite.dishes = req.body;
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, err => { next(err) })
                    }
                    else {
                        for (var idx = 0; idx < req.body.length; idx++) {
                            if (favorite.dishes.indexOf(req.body[idx]._id) === -1) {
                                favorite.dishes.push({ "_id": req.body[idx]._id });
                            }
                            favorite.save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, err => { next(err) })
                        }
                    }
                }
                else {
                    Favorites.create({ "user": req.user._id })
                        .then((favorite) => {
                            if (null != favorite) {
                                if (null == favorite.dishes || favorite.dishes.length === 0) {
                                    favorite.dishes = req.body;
                                    favorite.save()
                                        .then((favorite) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(favorite);
                                        }, err => { next(err) })
                                }
                            }
                        }, err => { next(err) });
                }
            }, err => { next(err) })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite.dishes && favorite.dishes.length) {
                    favorite.dishes = [];
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, err => { next(err) })
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /dishes/' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (null != favorite) {
                    if (null == favorite.dishes || favorite.dishes.length === 0) {
                        favorite.dishes = [{ "_id": req.params.dishId }];
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, err => { next(err) })
                    }
                    else {
                        if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                            favorite.dishes.push({ "_id": req.params.dishId });
                            favorite.save()
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, err => { next(err) })
                        }
                        else {
                            res.statusCode = 422;
                            res.end('dish with dishId: ' + req.params.dishId + ' is already in your favorites');
                        }
                    }
                }
                else {
                    Favorites.create({ "user": req.user._id })
                        .then((favorite) => {
                            if (null != favorite) {
                                if (null == favorite.dishes || favorite.dishes.length === 0) {
                                    favorite.dishes = [{ "_id": req.params.dishId }];
                                }
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }
                        }, err => { next(err) });
                }
            }, err => { next(err) })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ "user": req.user._id })
            .then((favorite) => {
                if (null == favorite.dishes || favorite.dishes.length === 0 || favorite.dishes.indexOf(req.params.dishId) === -1) {
                    res.statusCode = 404;
                    res.end('dish with dishId: ' + req.params.dishId + ' does not exist in your favorites');
                }
                else {
                    var index = favorite.dishes.indexOf(req.params.dishId);
                    favorite.dishes.splice(index, 1);
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, err => { next(err) })
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = favoriteRouter;