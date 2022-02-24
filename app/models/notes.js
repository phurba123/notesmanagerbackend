const mongoose = require('mongoose');
const schema = mongoose.Schema;

let mySchema = new schema({
    id:{
        type:String,
        unique:true
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