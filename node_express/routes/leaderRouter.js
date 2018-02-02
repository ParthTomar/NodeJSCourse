const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('content-Type', 'text/plain');
        // res.end('<html><body><h1>This is an express server</h1></body></html>');
        next(); //processes next item related to dishes: calls get-> dishes [based on req.method type]
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the leaders!');
    });

leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('content-Type', 'text/plain');
        // res.end('<html><body><h1>This is an express server</h1></body></html>');
        next(); //processes next item related to dishes: calls get-> dishes [based on req.method type]
    })
    .get((req, res, next) => {
        res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /leader/' + req.params.leaderId);
    })
    .put((req, res, next) => {
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('Will update the leader: ' + req.body.name + ' with details ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting leader: ' + req.params.leaderId);
    })

module.exports = leaderRouter;