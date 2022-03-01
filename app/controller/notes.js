
//create note

const checkLib = require("../lib/checkLib");
const logger = require('../lib/responseLib');
const mongoose = require('mongoose');
const uniqueId = require('uniqid');

let notesModel = mongoose.model('notesModel');

let apiresponse;

let createNote = (req,res)=>
{
    //validation later
    let saveNote = ()=>
    {
        return new Promise((resolve,reject)=>
        {
            if(checkLib.isEmpty(req.body.topic))
            {
                apiresponse = logger.generate(true,'topic is empty',500,null)
                reject(apiresponse)
            }
            else if(checkLib.isEmpty(req.body.userId))
            {
                apiresponse = logger.generate(true, 'user id not present', 500, null);
                reject(apiresponse);
            }
            else
            {
                let note = new notesModel({
                    userId : req.body.userId,
                    topic : req.body.topic,
                });
    
                note.save((err,newNote)=>
                {
                    if(err)
                    {
                        console.log('err : ', err)
                        apiresponse = logger.generate(true,'error while saving note',500,err);
                        reject(apiresponse)
                    }
                    else
                    {
                        apiresponse = logger.generate(false, 'new note group created',newNote);
                        resolve(apiresponse);
                    }
                })
            }
        })
    }
    

    saveNote(req,res).then((val)=>
    {
        res.send(val)
    }).catch((err)=>
    {
        res.send(err)
    })
}

// pushing content to a topic
let pushContent = (req,res)=>
{
    // check if topic id is present or not
    let checkTopicId = ()=>
    {
        return new Promise((resolve,reject)=>
        {
            //check if topic id params is empty or not
            if(checkLib.isEmpty(req.params.topicId && req.body.noteDesc))
            {
                apiresponse = logger.generate(true,'topic id or description is not present',500,null);
                reject(apiresponse);
            }

            // check if topic id is created or not
            notesModel.findOne({_id : req.params.topicId},(err,currentNote)=>
            {
                if(err)
                {
                    apiresponse = logger.generate(true, 'not able to find topic id',500,err);
                    reject(apiresponse);
                }
                else
                {
                    // apiresponse =logger.generate(false,'topic id found',200, currentNote);
                    resolve(currentNote);
                }
            })
        })
    };

    let pushContent = (topicDetail)=>
    {
        return new Promise((resolve,reject)=>
        {
            let note = {
                noteId : uniqueId(),
                noteDesc : req.body.noteDesc  // provide this in body
            };
            notesModel.updateOne({_id : topicDetail._id},
                {$push:{ notes : note}}, (err,updatedResult)=>
                {
                    if(err)
                    {
                        apiresponse = logger.generate(true, 'error on updating note', 500, err);
                        reject(apiresponse)
                    }
                    else
                    {
                        apiresponse = logger.generate(false, 'update notes', 200, updatedResult);
                        resolve(apiresponse)
                    }
                })
        })
    }

    checkTopicId(req,res)
    .then(pushContent)
    .then((val)=>
    {
        res.send(val);
    }).catch((err)=>
    {
        res.send(err);
    })
}

// get notes for provided notetopic id
let getNotes = (req,res)=>
{
    if(checkLib.isEmpty(req.params.notetopicid))
    {
        apiresponse = logger.generate(true,'no notestopic id provided in param',500,null);
        res.send(apiresponse)
    }
    else
    {
        notesModel.find({_id : req.params.notetopicid})
        .select('notes topic')
        .exec((err,allnotes)=>
        {
            if(err)
            {
                res.send(logger.generate(true,'failed to find notes of given topic',500,err));
            }
            else
            {
                res.send(logger.generate(false,'all notes found',200,allnotes));
            }
        })
    }
}

// get all topics
let getAllTopics = (req,res)=>
{
    console.log('inside get all topics')
    //
    let gettingAlltopics = ()=>
    {
        return new Promise((resolve,reject)=>
        {
            if(checkLib.isEmpty(req.params.id))
            {
                apiresponse = logger.generate(true,'no id provided',500,null);
                reject(apiresponse);
            }
            else
            {
                notesModel.find({userId : req.params.id})
                .select('-notes')
                .exec((err,allTopics)=>
                {
                    if(err)
                    {
                        apiresponse =logger.generate(true, 'error while finding notes', 500, err);
                        reject(apiresponse);
                    }
                    else
                    {
                        apiresponse =logger.generate(false, 'all note topics found', 200, allTopics);
                        resolve(apiresponse);
                    }
                })
            }
        })
    }

    gettingAlltopics(req,res)
    .then((val)=>
    {
        res.send(val);
    })
    .catch((err)=>
    {
        res.send(err);
    })
}

module.exports =
{
    createNote,
    getNotes,
    pushContent,
    getAllTopics
}