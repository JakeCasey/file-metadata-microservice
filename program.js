var express = require('express');
var app = express();
var fs = require('fs');

var path = require('path');

// npm multer
var multer = require('multer');

//defines how to store and name uploaded files.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, __dirname +'/uploads/tmp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var multer = multer({storage : storage});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + '/'));


//render index
app.get('/', function(req, res){

    res.render('index', {button : ''});
});

var upload = multer.single('up')

app.post('/uploads', upload,  function(req, res){
    var filepath = __dirname + '/uploads/tmp/' + req.file.originalname;
    
    upload(req, res, function(err){
        if(err){
            return err;
        }
    })
    
    //open stream for fs.fstat
    fs.open(filepath, 'r', function(err, fd){
        if(err){return err};
        //get fstat size
        fs.fstat(fd, function(err, fstat){
            if(err){return err};
            var data = {
                size : fstat.size
            }
            // send data obj
            res.send(data);
            // delete uploaded file
            fs.unlink(filepath);
        });
    });
    
});


//start app.
app.listen(8080, function(){
    console.log("Running")
});