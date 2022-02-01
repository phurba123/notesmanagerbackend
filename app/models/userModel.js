const mongoose = require('mongoose');
let schema = mongoose.Schema;

let userSchema = new schema(
    {
        firstName: {
            type: String,
            default: ''
        },
        middleName:{
            type:String,
            default:''
        },
        lastName: {
            type: String,
            default: ''
        },
        password: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            unique: true,
            default: ''
        },

        createdOn: {
            type: Date,
            default: ""
        },
        updatedOn:{
            type:Date,
            default:''
        }

    }
)

mongoose.model('userModel', userSchema);