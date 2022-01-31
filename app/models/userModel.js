const mongoose = require('mongoose');
let schema = mongoose.Schema;

let userSchema = new schema(
    {
        userId: {
            type: String,
            index: true,
            unique: true
        },
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