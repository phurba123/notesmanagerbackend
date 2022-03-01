const mongoose = require('mongoose');
const schema = mongoose.Schema;

let mySchema = new schema({
    userId:{
        type:String,
        required:true
    },
    topic :{
        type:String,
        default:''
    },
    createdOn : {
        type:Date,
        default:Date.now()
    },
    updatedOn : {
        type : Date,
        default:Date.now()
    },
    notes:[]
})

mongoose.model('notesModel',mySchema);