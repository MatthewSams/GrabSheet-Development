var express = require('express');
var router = express.Router();

router.get("/", (req,res) => {
    //res.render("index", {data: "hello"});
    res.render("index", {file: ""});
    
})




router.get('/download', (req,res) => {
    const file = `test.txt`
    res.download(file);
});

module.exports = router;