var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
const Chatkit = require('@pusher/chatkit-server');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const chatkit = new Chatkit.default({
	instanceLocator: 'v1:us1:1c60e6e2-9aba-4a6e-a6de-11ea9db8762a',
	key:
		'f9901d18-b911-4f51-8340-8520b10e0aa5:3coalA2tQLUrfr2kwty6gnnFFWID17X8CbgIqmwKn3Q='
})

app.post('/users', (req, res) => {
	const { username } = req.body.username
	chatkit
		.createUser({
			id: username,
			name: username
		})
		.then(() => res.sendStatus(201))
		.catch(error => {
			if (error.error === 'services/chatkit/user_already_exists') {
				res.sendStatus(200)
			} else {
				res.status(error.status).json(error)
			}
		})
})

app.post('/authenticate', (req, res) => {
	console.log('Console.log: ' + req.body.username)
	const authData = chatkit.authenticate({ userId: req.query.user_id })
	res.status(authData.status).send(authData.body)
})

require('./app/router/router.js')(app);

const db = require('./app/config/db.config.js');

const Role = db.role;

// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
// 	console.log('Drop and Resync with { force: true }');
// 	initial();
// });

// Create a Server
var server = app.listen(8080, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("App listening at http://%s:%s", host, port)
})

function initial() {
	Role.create({
		id: 1,
		name: "USER"
	});

	Role.create({
		id: 2,
		name: "PM"
	});

	Role.create({
		id: 3,
		name: "ADMIN"
	});
}