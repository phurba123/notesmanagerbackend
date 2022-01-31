const http = require('http');
let appConfig = require('./appconfig');
const express = require('express');
// express app
const app = express();

// routes files import
const userRoutes = require('./app/routes/userRoute');

// routes direct
app.use(`${appConfig.apiVersion}/users`,userRoutes);


// create and listen to server
let server = http.createServer(app);
server.listen(appConfig.port);
server.on('listening', onListening);
server.on('error', onError);

// callback function when server is listening

function onListening()
{
    console.log('server listening on port : ' + appConfig.port);
}

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
            console.log('error : ',error)
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
