const http = require('http');
let appConfig = require('./appconfig');
const express = require('express');
// express app
const app = express();

// routes files import
const userRoutes = require('./app/routes/userRoute');

// routes direct
app.use(`${appConfig.apiVersion}/users`,userRoutes);

app.listen(appConfig.port, ()=>
{
    console.log(`app listening at port ${appConfig.port}`)
})
