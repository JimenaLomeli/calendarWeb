const express = require('express');
const path = require('path');
//const bodyParser = require("body-parser");

const port = process.env.PORT || 3000


const mongos = require('mongoskin')
const db = mongos.db("mongodb+srv://admin:admin19@cluster0-ztqvu.mongodb.net/test?retryWrites=true&w=majority", { w: 0});
db.bind('event');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

app.get('/init', function(req, res){
	db.event.insert({ 
		text:"Test event A", 
		start_date: new Date(2019,11,29),
		end_date:	new Date(2019,12,5)
	});
	db.event.insert({ 
		text:"Test event", 
		start_date: new Date(2019,12,3),
		end_date:	new Date(2019,12,8),
		color: "#DD8616"
	});

	res.send("Test events were added to the database")
});


app.get('/data', function(req, res){
	db.event.find().toArray(function(err, data){
		//set id property for all records
		for (const i = 0; i < data.length; i++)
			data[i].id = data[i]._id;
		
		//output response
		res.send(data);
	});
	// LLAMAR AL BACKEND
});


app.post('/data', function(req, res){
	const data = req.body;
	const mode = data["!nativeeditor_status"];
	const sid = data.id;
	const tid = sid;

	delete data.id;
	delete data.gr_id;
	delete data["!nativeeditor_status"];


	function update_response(err, result){
		if (err)
			mode = "error";
		else if (mode == "inserted")
			tid = data._id;

		res.setHeader("Content-Type","application/json");
		res.send({action: mode, sid: sid, tid: tid});
	}
	//MANDAR AL BACKEND
	if (mode == "updated")
		db.event.updateById( sid, data, update_response);
	else if (mode == "inserted")
		db.event.insert(data, update_response);
	else if (mode == "deleted")
		db.event.removeById( sid, update_response);
	else
		res.send("Not supported operation");
});

app.get('*', function(req, res){ 
		 	res.send({
		 		error: 'Ruta no valida'
 	})
})
app.listen(port, function(){
	console.log('Server up and running on port', port)
})