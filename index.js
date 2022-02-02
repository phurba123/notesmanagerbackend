const http = require('http');
let appConfig = require('./appconfig');
const express = require('express');
// express app
const app = express();
let fs = require('fs');
const mongoose = require('mongoose');
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//Bootstrap models
let modelsPath = ('./app/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelsPath + '/' + file)
});
// end Bootstrap models

// routes files import
const userRoutes = require('./app/routes/userRoute');

// routes direct
app.use(`${appConfig.apiVersion}/users`, userRoutes);


// create and listen to server
let server = http.createServer(app);
server.listen(appConfig.port);
server.on('listening', onListening);
server.on('error', onError);

// callback function when server is listening

function onListening() {
    console.log('server listening on port : ' + appConfig.port);

    // connect to db on server setup
    mongoose.connect(appConfig.db.uri, { useNewUrlParser: true, useUnifiedTopology: true }).catch((err) => {
        console.log('error while establishing db connection : ', err);
    })
}

// events for mongoose connection
mongoose.connection.on('error', (err) => {
    console.log('mongoose error handler report : ', err)
})

mongoose.connection.on('open', (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log('database connection open');

    }
})
// end of events for mongoose connections

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
        throw error;
    }


    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            // logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10);
            console.log('error : ', error)
            // process.exit(1);
            break;
        case 'EADDRINUSE':
            // logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10);
            console.log('error : ', error)
            // process.exit(1);
            break;
        default:
            // logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
            console.log('error : ', error)
            throw error;
    }
}
