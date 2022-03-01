var express = require('express');
var router = express.Router();

/*
controllers import
*/
let notesController = require('../controller/notes');

// middleware section , either use local middleware to this route or make common middleware ,import and use it

/* 
routes for users crud operation
*/

// getting topics of all notes
// router.get('/all', userController.getAllUsers);

// creating new notes
router.post('/create', notesController.createNote);

// pushing content to topic
/**
 *  Body , noteDesc, topicId
 */
router.post('/input/:topicId', notesController.pushContent);

//get notes for provided notetopic id
router.get('/get/:notetopicid', notesController.getNotes);

router.get('/hello', (req,res)=>res.send('hello bro'));

//getting all topics
router.get('/get/all/:id', notesController.getAllTopics);

module.exports = router;
