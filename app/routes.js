var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('./db');
var DarkSky = require('dark-sky');
var darkSkyClient = new DarkSky(process.env.DARKSKY_KEY);


//get current weather and forecast
router.post('/api/weather', async function(req,res,err){
	var lat = req.body.lat;
	var lng = req.body.lng;

	const position = {
		latitude: lat,
		longitude: lng
	};

	try {
		var forecast = await darkSkyClient
		.coordinates({lat: lat, lng: lng})
		.units('auto')
		.language('en')
		.exclude('minutely,daily')
		.get()
		res.json({"currently":forecast.currently, "forecast":forecast.hourly});
	} catch (err) {
		res.json({"error":err});
	}

});

//get historic weather data
router.post('/api/weather/past', async function(req,res,next){

	var latitude = req.body.lat;
	var longitude = req.body.lng;
	var time = req.body.time;

	try {
		var forecast = await darkSkyClient
		.coordinates({lat: latitude, lng: longitude})
		.time(time)
		.units('auto')
		.language('en')
		.exclude('minutely')
		.get()
		res.json({"hourly":forecast.hourly, "daily":forecast.daily});

	} catch (err) {
		res.json({"error":err});
	}
});

//get user for login
router.get('/api/user', async function(req, res) {
	var username = req.query.username;
	var pass = req.query.password;
	const doc = await db.users.findOne(
	{
		'username' : req.query.username ,
		'password': req.query.password
	}
	);
	res.json({"user":doc});

});

//post new user to db
router.post('/api/user', async function(req,res){
	var myUsername = req.body.username;
	var pass = req.body.password;

	const doc = await db.users.save({username:myUsername, password:pass, searches:[]});
	res.json({"user":doc});

});

//get searches from user
router.get('/api/user/searches', async function(req,res){
	var username = req.query.username;
	const doc = await db.users.findOne(
	{
		'username' : req.query.username
	}
	);
	res.json({"user":doc});
});

//post new search to db
router.post('/api/user/searches', async function(req,res){
	const doc = await db.users.update(
		{ 'username': req.body.username },
		{ $push: { 'searches': req.body.search } }
		);

	const searches = await db.users.findOne({'username': req.body.username});
	res.json({"user":searches});
});

router.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '../public/views', 'index.html'));
});

module.exports = router;
