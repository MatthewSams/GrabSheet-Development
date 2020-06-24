const express = require("express");
var router = express.Router();
const multer = require('multer');
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient();
var firebase = require("firebase/app");
//const {Storage} = require('@google-cloud/storage');
var config = require('../config/config');
const ImageDataURI = require('image-data-uri');

//firebase json file configuration
const serviceAccount = require('../config/ballsackeroo-df21901aafc1.json');

//firebae app configuration
var admin = require("firebase-admin");
const appConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebaseConfig.databaseURL,
  storageBucket: config.firebaseConfig.storageBucket
};

//firebase initialization with admin configuration
const fb = admin.initializeApp(appConfig);

//firebase bucket configuration
const bucket = admin.storage().bucket();

//storage
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './public/uploads/' );
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname);
    }
});

//save user uploaded image locally
const upload = multer({
  storage: storage , 
  limits:{fileSize: 1000000}
}).single("raw_img");

//upload request
router.post('/upload', (req, res) => {

  //upload function
  upload(req, res, err => {
    //saves local filepath in filepath variable
    let filepath = `uploads/${req.file.filename}`

    if(err){
      //handling error with upload request
      res.render('index', {
        msg: err
      });
    } else {
      //if no file is selected
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        //if no errors
        //upload to firebase/google cloud bucket
        //bucket.upload( `./public/${filepath}`, {
          //destination: `${req.file.filename}`,
        //console.log();
          /*gzip: true,
          metadata: {
            cacheControl: 'public, max-age=31536000'
          }*/
          
        //renders index.ejs with the file variable defined with the filepath so it can be read
        res.render('index', {
          file: filepath
        });
      }
    }
  });

});


module.exports = router;