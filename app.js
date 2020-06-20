//declare imports
const express = require("express");
const app = express();
const fs = require("fs");
const util = require("util");
const bodyParser = require('body-parser');

//setting up bodyparser to extract text information from EJS files
app.use(bodyParser.urlencoded({ 
    extended: true,
    limit: '50mb' 
}));
app.use(bodyParser.json());

//routes
app.set("view engine","ejs");
app.use(require("./routes/router"));
app.use(require("./routes/upload"));

// Public Folder
app.use(express.static('./public'));

//Start up server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running on port ${PORT}`));