/* controller functions for user routes */

// necessary imports
let mongoose = require('mongoose');
let userModel = mongoose.model('userModel');
let authModel = mongoose.model('authModel');
let responseLib = require('../lib/responseLib');
let passwordLib = require('../lib/passwordLib');
let tokenLib = require('../lib/tokenLib');
let checkLib = require('../lib/checkLib');

// common variable for sending response to client
let response;

// creating new user
function createUser(req, res) {
    // new user object
    let userObj = new userModel({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordLib.hashPassword(req.body.password),
        createdOn: new Date(),
        updatedOn: new Date()
    });

    // TODO :-  validation  for body 

    // check if user exist or not
    userModel.findOne({ email: req.body.email }, (err, result) => {
        if (err) {
            console.log('failed to create user : ', err);
            response = responseLib.generate(true, 'could not check for existing user', 500, err);
            res.send(response);
        }
        else if (result === undefined || result === null || result === '') {
            // no user found , so create a new user
            userObj.save((err, newUser) => {
                if (err) {
                    console.log('err : ', err);
                    response = responseLib.generate(true, 'error while saving data', 500, err);
                    res.send(response);
                }
                else {
                    console.log('new user created : ', newUser);
                    response = responseLib.generate(false, 'new user created', 200, newUser)
                    res.send(response)
                }
            })
        }
        else {
            // if user is found , it means user is already present
            console.log('user already present');
            response = responseLib.generate(true, 'user already present', 500, result)
            res.send(response);
        }
    })
} // end of create new user controller

// getting all users
let getAllUsers = (req, res) => {
    console.log('get all users');

    userModel.find()
        .select('-password')
        .exec((err, allUsers) => {
            if (err) {
                response = responseLib.generate(true, 'error while fetching all users', 500, err);
                res.send(response)
            }
            else {
                response = responseLib.generate(false, 'list of all users', 200, allUsers);
                res.send(response)
            }
        })
}

// getting single user
let singleUser = (req, res) => {
    console.log('single user');
    console.log('req.params.id is : ', req.params.id);
    // res.send('getting single user with id : ' + req.params.id);
    if (req.params.id === null || req.params.id === undefined || req.params.id === '') {
        response = responseLib.generate(true, 'Id not present at params', 500, null);
        res.send(response);
    }
    else {
        userModel.findOne({ _id: req.params.id }, (err, user) => {
            if (err) {
                response = responseLib.generate(true, 'Error while finding user of given id', 500, err);
                res.send(response);
            }
            else {
                response = responseLib.generate(false, 'User found ', 200, user);
                res.send(response);
            }
        }).select('-password')
    }
}

// signIn user
let signInUser = (req, res) => {
    //using promise for finding user
    let findUser = () => {
        //function for finding a user
        console.log('find user');
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                userModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    if (err) {
                        // logger.error(err.message, 'userController:loginUser:findUser', 10);
                        response = responseLib.generate(true, 'failed to find user detail', 500, null);
                        reject(response)
                    }
                    else if (userDetails === {} || userDetails === null || userDetails === undefined) {
                        //userdetails is empty so it means that the user with given email is not 
                        //registered yet
                        // logger.info('no user found with given email', 'userController:findUser', 7);
                        response = responseLib.generate(true, 'no user details found', 404, null);
                        reject(response)
                    }
                    else {
                        // logger.info('user found', 'userController:findUser', 10);
                        resolve(userDetails);
                    }
                })
            }
            else {
                //if email is not present then execute this else
                // logger.error('email is missing', 'userController:findUser', 10);
                response = responseLib.generate(true, 'email is missing', 400, null);
                reject(response);
            }
        });//end of promise
    }//end of findUser

    let validatePassword = (retrievedUserDetails) => {
        //validating password provided
        console.log('validate password');
        return new Promise((resolve, reject) => {
            if (!req.body.password) {
                response = responseLib.generate(true, 'password is missing', 400, 10)
                reject(response)
            }
            else {
                passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                    if (err) {
                        // logger.error(err.message, 'userController:validatePassword', 10);
                        response = responseLib.generate(true, 'login failed', 500, null);
                        reject(response);
                    }
                    else if (isMatch) {
                        //converting mongoose object to normal javascript object 
                        let retrievedUserDetailsObj = retrievedUserDetails.toObject();
                        delete retrievedUserDetailsObj.password;
                        delete retrievedUserDetailsObj.__v;
                        resolve(retrievedUserDetailsObj);
                    }
                    else {
                        // logger.info('login failed due to invalid password', 5);
                        response = responseLib.generate(true, 'wrong password login failed', 400, null);
                        reject(response);
                    }
                })
            }
        })
    }//end of validating password

    let generateToken = (userDetails) => {
        //generating token on validation
        console.log('generate token');
        return new Promise((resolve, reject) => {
            tokenLib.generateToken(userDetails, (error, tokenDetails) => {
                if (error) {
                    console.log(error);
                    response = responseLib.generate(true, 'failed to generate token', 500, null);
                    reject(response);
                }
                else {
                    tokenDetails.userDetails = userDetails;
                    resolve(tokenDetails);
                }
            })
        })
    }//end of generating token

    //saving generated token
    let saveToken = (tokenDetails) => {
        console.log('save token');

        return new Promise((resolve, reject) => {
            authModel.findOne({ 'userId': tokenDetails.userDetails._id }, (err, retrievedTokenDetails) => {
                if (err) {
                    // logger.error(err.message, 'userController:saveToken', 10);
                    response = responseLib.generate(true, err.message, 500, null);
                    reject(response);
                }
                else if (checkLib.isEmpty(retrievedTokenDetails)) {
                    //save new auth
                    let newauthModel = new authModel(
                        {
                            userId: tokenDetails.userDetails._id,
                            authToken: tokenDetails.token,
                            tokenSecret: tokenDetails.tokenSecret,
                            tokenGenerationTime: Date.now()
                        }
                    );

                    newauthModel.save((err, newTokenDetails) => {
                        if (err) {
                            // logger.error('error while saving new auth model', 'userController:savetoken', 10);
                            response = responseLib.generate(true, err.message, 500, null);
                            reject(response)
                        }
                        else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }

                            resolve(responseBody)
                        }
                    })
                }
                else {
                    //already present,so,update it
                    retrievedTokenDetails.authToken = tokenDetails.token;
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret;
                    retrievedTokenDetails.tokenGenerationTime = Date.now();
                    console.log('retrievedTokenDetails : ', retrievedTokenDetails);

                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            // logger.error('error while updating token', 'userController:savetoken', 10);
                            response = responseLib.generate(true, err, 500, null);
                            reject(response)
                        }
                        else {
                            //console.log('new token details after log in'+newTokenDetails.authToken)
                            console.log('newtokendetails : ' + newTokenDetails)
                            let response = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(response)
                        }
                    })
                }
            })
        });//end of promise for saving token
    }//end of savetoken function

    findUser()
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((val) => {
            response = responseLib.generate(false, 'login successfull', 200, val)
            res.send(response)
        })
        .catch((err) => {
            res.send(err)
        })

}

let signOutUser = (req, res) => {
    authModel.findOneAndRemove({ userId: req.params.userId }, (err, result) => {
        if (err) {
            console.log(err)
            // logger.error(err.message, 'user Controller: logout', 10)
            response = responseLib.generate(true, `error occurred: ${err.message}`, 500, null)
            res.send(response)
        } else if (checkLib.isEmpty(result)) {
            response = responseLib.generate(true, 'Already Logged Out or Invalid UserId', 404, null)
            res.send(response)
        } else {
            response = responseLib.generate(false, 'Logged Out Successfully', 200, null)
            res.send(response)
        }
    })
}

module.exports = {
    createUser,
    getAllUsers,
    singleUser,
    signInUser,
    signOutUser,
}