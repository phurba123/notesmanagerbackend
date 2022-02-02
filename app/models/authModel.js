const mongoose = require('mongoose');
const schema = mongoose.Schema;
// const time = require('../libs/timeLib')

let authModel = new schema(
    {
        userId: {
            type: String
        },

        authToken:
        {
            type: String
        },

        tokenSecret:
        {
            type: String
        },

        tokenGenerationTime:
        {
            type: Date,
            default: Date.now()
        }
    }
);
mongoose.model('authModel', authModel);
