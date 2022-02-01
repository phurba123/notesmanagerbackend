/* controller functions for user routes */

// necessary imports
let mongoose = require('mongoose');
let userModel = mongoose.model('userModel');
let responseLib = require('../lib/responseLib');

// common variable for sending response to client
let  response;

// creating new user
function createUser(req, res) {
    // new user object
    let userObj = new userModel({
        firstName: req.body.firstName,
        middleName: req.body.secondName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        createdOn: new Date(),
        updatedOn: new Date()
    });

    // TODO :-  validation  for body 

    // check if user exist or not
    userModel.findOne({email : req.body.email}, (err,result)=>
    {
        if(err)
        {
            console.log('failed to create user : ', err);
            response = responseLib.generate(true, 'could not check for existing user',500,err);
            res.send(response);
        }
        else if(result === undefined || result === null || result === ''){
            // no user found , so create a new user
            userObj.save((err, newUser)=>
            {
                if(err)
                {
                    console.log('err : ', err);
                    response = responseLib.generate(true, 'error while saving data',500,err);
                    res.send(response);
                }
                else
                {
                    console.log('new user created : ',newUser);
                    response = responseLib.generate(false, 'new user created', 200,newUser)
                    res.send(response)
                }
            })
        }
        else
        {
            // if user is found , it means user is already present
            console.log('user already present');
            response = responseLib.generate(true, 'user already present',500,result)
            res.send(response);
        }
    })
} // end of create new user controller

// getting all users
let getAllUsers = (req, res) => {
    console.log('get all users');

    userModel.find()
    .select('-password')
    .exec((err, allUsers)=>
    {
        if(err)
        {
            response = responseLib.generate(true, 'error while fetching all users',500,err);
            res.send(response)
        }
        else
        {
            response = responseLib.generate(false,'list of all users',200,allUsers);
            res.send(response)
        }
    })
}

// getting single user
let singleUser = (req, res) => {
    console.log('single user')
    // res.send('getting single user with id : ' + req.params.id);
}

module.exports = {
    createUser,
    getAllUsers,
    singleUser
}