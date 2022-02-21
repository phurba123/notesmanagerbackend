var express = require('express');
var router = express.Router();
const appConfig = require('../../appconfig');

/*
controllers import
*/
let userController = require('../controller/user');

// middleware section , either use local middleware to this route or make common middleware ,import and use it

/* 
routes for users crud operation
*/

// getting all the users
router.get('/all', userController.getAllUsers);

// creating new user
router.post('/create', userController.createUser);

// getting single user
router.get('/user/:userId', userController.singleUser);

// signing in user
router.post('/login', userController.signInUser);

// logout , TODO, add auth middleware to signout later
router.post('/logout/:userId', userController.signOutUser);
router.get('/hello', (req,res)=>
{
    res.send('hello phursang howdy')
})

module.exports = router;
