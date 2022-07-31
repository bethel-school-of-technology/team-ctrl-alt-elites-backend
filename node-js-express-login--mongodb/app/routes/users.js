require('dotenv').config();
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
var express = require('express');
var router = express.Router();
var  User  = require('../models/user.model')
const multer = require ('multer');
const { Storage } = require('@google-cloud/storage');


const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, //keep images size < 5MB
  }
})

//connects to firebase and the storage part of firebase
const storage = new Storage ({
//this will allow my server to talk to firebase
  projectId: process.env.FIREBASE_PROJECT_ID,
  keyFilename: process.env.FIREBASE_KEY
  //will protect this info through environment variables (.env) and not put them in source control
});

//connect to firebase bucket
const bucket = storage.bucket(process.env.FIREBASE_BUCKET);

//unprotected route
// GET ALL from new User Model
router.get('/', async function(req, res, next) {
  try{
    const users = await User.find();
    res.status(200).json({
      data: { users }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
});

// GET ONE
router.get('/:id', async function(req, res, next) {
  try{
      let id = req.params.id;
      const user = await User.findById(id);

      res.status(200).json({
        data: { user }
      });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
  
});



// Post new profile
router.post('/add', async function (req, res ) {
    try {
      const newOwner = await Owner.create(req.body);

      res.status(201).json({
        data: { owners: newOwner }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
});


// UPDATE
router.put('/update/:id', async function (req, res ) {
  try {
    const users = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      data: { users }
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    });
  }
});



// DELETE
router.delete('/delete/:id', async function (req, res ) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    });
  }
});

//POST uploader for creating an image
router.post('/:id/photo', uploader.single('image'), async (req, res, next) => {
  
  
    const id = req.params.id;
    if (!id || id <= 0 ){
      res.status(400).send('Invalid ID');
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(403).send();
      return;
    }  

    //const owner = await Owner.findById(id);

    //res.status(200). json({
      //data: { owner }

      // Upload endpoint to send file to Firebase storage bucket
    try {
        if (!req.file) { 
          //req.file = this is where the file is in the server
          res.status(400).send('No file uploaded');
          console.log(req.file)
          return;
        }

        // Create new blob in the bucket referencing the file
        const blob = bucket.file(req.file.originalname);
        console.log(blob)

        // Create writable stream and specifying file mimetype
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        blobStream.on('error', (err) => {
          console.log(err);
          next(err);
        });

        blobStream.on('finish', () => {
          // Assembling public URL for accessing the file via HTTP
          const encodedName = encodeURI(blob.name);
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedName}?alt=media`;
          
          //save URL on the profile
          res.status(200).send({ 
            fileName: req.file.originalname,
            fileLocation: publicUrl

            //or res,send(publicUrl);
        });
          console.log(publicUrl);
        });

        // When there is no more data to be consumed from the stream
        blobStream.end(req.file.buffer);

    } catch (error) {
      res.status(400).send(`Error uploading file: ${error}`);
      return;
    }

    });


module.exports = router;