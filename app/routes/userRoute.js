var express = require('express');
var router = express.Router();
const appConfig = require('../../appConfig')

// middleware section , either use local middleware to this route or make common middleware ,import and use it

/* 
routes for users crud operation
*/

// getting all the users
router.get('/', (req,res)=>
{
    res.send('you looked for https://localhost:3000/api/v1/users for collecting all the users info')
})

// creating new user
router.post('/create',(req,res)=>
{
    res.json({"status":200,"info":"you are requesting to create a new user"});
})

// getting single user
router.get('/:name',(req,res)=>
{
    console.log('passed param : ', req.params.name)
    res.json({
        "status":200,
        "info":"you are requesting info of a user named "+req.params.name
    });
})

module.exports = router;
