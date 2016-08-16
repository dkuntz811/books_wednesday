var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';
//

router.get('/', function (req, res){
	//Retrieve books from database
	pg.connect(connectionString, function(err, client, done){
		if (err){
			res.sendStatus(500);
		}
		client.query('SELECT * FROM books', function (err, result){
			done(); //put this here because the info has been received and is
              //ready to be sent below. this closes the connection to the server
			if (err) {
				res.sendStatus(500);
			}
			res.send(result.rows);
		});
	});

});

router.post('/', function (req, res) {
	var book = req.body;

	pg.connect(connectionString, function (err, client, done){
	   if (err){
			 res.sendStatus(500);
		 }
		 client.query('INSERT INTO books (author, title, published, edition, publisher)'
	 						+ 'VALUES ($1, $2, $3, $4, $5)', //I am expecting that $1 is going to be author varchar(200) from server
						  [book.author, book.title, book.published, book.edition, book.publisher],
						function (err, result){
							done();

							if (err) {
								res.sendStatus(500);
							}
							res.sendStatus(201);
						});
	});
});

module.exports=router;
