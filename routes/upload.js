const express = require("express");
var router = express.Router();
const multer = require('multer');
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient();
var firebase = require("firebase/app");
//const {Storage} = require('@google-cloud/storage');
var config = require('../config/config');
const ImageDataURI = require('image-data-uri');




const serviceAccount = require('../config/ballsackeroo-df21901aafc1.json');

var admin = require("firebase-admin");
const appConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebaseConfig.databaseURL,
  storageBucket: config.firebaseConfig.storageBucket
};

const fb = admin.initializeApp(appConfig);


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

const upload = multer({
  storage: storage , 
  limits:{fileSize: 1000000}
}).single("raw_img");


router.post('/cropped', async (req, res) =>{
  console.log("successfully got the cropped request");
  const dataURI = req.body.cropped_img;
  var fileName = `./public/uploads/cropped-image`;
  
  ImageDataURI.outputFile(dataURI, fileName);
  fileName = fileName+'.jpeg';
    /*client.
    textDetection(fileName+'.jpeg')
      .then(results => {
          const detections = results[0].textAnnotations;

          

          console.log('Text:');
          detections.forEach(text => 
              res.render('index', {data: text.description}));

      })
      .catch(err => {
          //res.render(err);
          console.log(err);
      });*/
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    console.log('Text:');
    detections.forEach(text => console.log(text));
      

  
  
});



//upload request
router.post('/upload', (req, res) => {

  //upload function
  upload(req, res, err => {
    //saves local filepath in filepath variable
    let filepath = `uploads/${req.file.filename}`

    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        //upload to firebase/google cloud bucket
        //bucket.upload( `./public/${filepath}`, {
          //destination: `${req.file.filename}`,
        console.log();
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

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}