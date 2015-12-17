var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    promise = require('promise');

var app = express();


app.get('/user/:id', function(req, res) {
    //1. create a file named id in the tmp folder under current folder
    //2. write the current time into the file. OVERWRITE
    //3. return '<p>{{current path}}</p><p>{{contents of the file}}</p>

    var p = __dirname; //path.dirname(require.main.filename);
    var id = req.params.id;
    writeFile(fs, p, id)
		.then(function(data) { //if write succeeds do following
	        console.log('resolved');
		  	readFile(fs, p, id)
				.then(function(data) { //if read succeed, doc.write
				    res.send("<p>" + p + "</p><p>" + data + "</p>");
			    })
				.catch(function(err) {
		        console.log(err);
		        throw err;
		    	});
	    })
		.catch(function(err) {
        console.log('ERROR: ',err);
        throw err;
    	});
});



var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);


});

function writeFile(fsys, p, id) {
    var d = new Date();
    return new Promise(function(resolve, reject) {
        fsys.writeFile(path.resolve(p, 'tmp', id + '.txt'), d.toTimeString(), 'utf8', function(err, res) {
            if (err) reject(err);
            else resolve(res);
        });

    });
}

function readFile(fsys, p, id) {
    /*
    // Asynchronous read
    fs.open('id.txt', 'r', function (err, data) {
    	if (err) {
    		return console.error(err);
    		
    	}
    	console.error(data);
    	var buf = new Buffer(8192);
    	buf.fill('');
    	fs.read(data, buf, 0, 8192, 0, function(err, bytesread, buffer)
    	{
    		console.log(err,bytesread, buffer.toString(undefined,0,bytesread));
    		console.log(buffer.slice(0,bytesread).toString());
    	});
    	console.log("Asynchronous read: " + data.toString());
    }); //*/

    return new Promise(function(resolve, reject) {
        fsys.readFile(path.resolve(p, 'tmp', id + '.txt'), 'utf8', function(err, res) {
			console.log(res);
            if (err) reject(err);
            else resolve(res);
        });
    });
}