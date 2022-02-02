const jwt = require('jsonwebtoken')
const shortId = require('shortid');

const secretKey = 'randommeansaveryrandomkey';

//function for generating tokens with jwt
let generateToken = (data, cb) => {
    try {
        let claims =
        {
            jwtid: shortId.generate(),
            iat: Date.now(),
            exp: (Date.now()) + (60 * 60 * 24 * 60),
            sub: 'authToken',
            iss: 'ToDo-List',
            data: data
        };

        let tokenDetails =
        {
            token: jwt.sign(claims, secretKey),
            tokenSecret: secretKey
        }

        cb(null, tokenDetails);
    }
    catch (error) {
        console.log(error);
        cb(error, null);
    };

}//end of generate token

//function for verifying claim
let verifyClaim = (token, secretKey, cb) => {
    //verify a token symmetric
    jwt.verify(token, secretKey, function (error, decoded) {
        if (error) {
            console.log('error while verifying token');
            console.log(error);
            cb(error, null);
        }
        else {
            console.log('user verified');
            //console.log(decoded);
            cb(null, decoded);
        }
    });
}//end of verify claim

//function for verifying claim without secret key
let verifyClaimWithoutSecret = (token, cb) => {
    //verify token
    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            console.log('error while verifying token without secret key');
            console.log(error);
            cb(error, null);
        }
        else {
            console.log('user verified');
            cb(null, decoded);
        }
    })
}

module.exports =
    {
        generateToken,
        verifyClaim,
        verifyClaimWithoutSecret
    }
