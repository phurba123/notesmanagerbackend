const bcrypt = require('bcrypt');
// const logger = require('./loggerLib');
const generatePassword = require('generate-password')

const saltRounds = 10;

let hashPassword = (myPlaintextPassword) => {
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(myPlaintextPassword, salt);
    return hash;
}

let comparePassword = (password, hashPassword, cb) => {
    bcrypt.compare(password, hashPassword, (err, res) => {
        if (err) {
            // logger.error(err.message, 'generatePasswordLib:comparePassword()', 10);
            console.log('err on comparepassword : ', err);
            cb(err, null);
        }
        else {
            cb(null, res);
        }
    })
}//

//generating new password when user forgots password
//generate new password
let generateNewPassword =()=>
{

    let password = generatePassword.generate({
        length: 8,
        numbers: true
    });
    return password;
}
module.exports =
    {
        hashPassword,
        comparePassword,
        generateNewPassword
    }