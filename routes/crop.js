const express = require("express");
var router = express.Router();
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient();
var config = require('../config/config');
const ImageDataURI = require('image-data-uri');
const atob = require("atob");

//cropping method
router.post('/cropped', async (req, res) =>{
    //console.log("successfully got the cropped request");

    //read in dataURI of cropped image
    const dataURI = req.body.cropped_img;
    //const dataURI_filename = req.body.cropped_img_filename;

    //set filename of cropped image to save locally
    var fileName = `./public/uploads/cropped-image`;
    var ocr_text = [''];
    //console.log(dataURI);
    
    //saves file locally using dataURI
    ImageDataURI.outputFile(dataURI, fileName);

    //fileType grabs filetype of cropped image
    var fileType = dataURI.substring(dataURI.indexOf(":")+1, dataURI.indexOf(";"));
    //console.log(fileType);
    fileType = fileType.substring(fileType.indexOf('/')+1);
    fileName = fileName + '.' + fileType;

    console.log(fileName);

    //text detection using Google OCR
    try {
        //upload cropped image that was locally saved
        const [result] = await client.textDetection(fileName);
        const detections = result.textAnnotations;
        console.log('Text:');

        //output of Google OCR
        //detections.forEach(text => console.log(text.description));
        detections.forEach(text => ocr_text.push(text.description));
        //detections.forEach(text => 
            //res.render('clipboard', {data: text.description}));
        console.log(ocr_text);
        
    } catch(err) {
        //next(err);
        console.log(err);
    }
  });

  function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
}

  module.exports = router;