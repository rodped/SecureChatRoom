const db = require('../config/db.config.js');
const config = require('../config/config.js');
const Chatkit = require('@pusher/chatkit-server');

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const chatkit = new Chatkit.default({
	instanceLocator: 'v1:us1:1c60e6e2-9aba-4a6e-a6de-11ea9db8762a',
	key:
		'f9901d18-b911-4f51-8340-8520b10e0aa5:3coalA2tQLUrfr2kwty6gnnFFWID17X8CbgIqmwKn3Q='
})

var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);

exports.signup = (req, res) => {
	// Save User to Database
	User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password
	}).then(user => {
		Role.findAll({
			where: {
				name: {
					[Op.or]: req.body.roles
				}
			}
		}).then(roles => {
			user.setRoles(roles).then(() => {
				res.send({ message: 'Registered successfully!' });
			});
		}).catch(err => {
			res.status(500).send({ reason: err.message });
		});
	}).catch(err => {
		res.status(500).send({ reason: err.message });
	})
}

exports.signin = (req, res) => {
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send({ reason: 'User Not Found.' });
		}

		var passwordIsValid = bcrypt.compareSync(encryptor.decrypt(req.body.password), user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password!' });
		}

		var token = jwt.sign({ id: user.id }, config.secret, {
			expiresIn: 3600 // expires in 1 hours
		});

		var authorities = [];
		user.getRoles().then(roles => {
			for (let i = 0; i < roles.length; i++) {
				authorities.push('ROLE_' + roles[i].name.toUpperCase());
			}
			res.status(200).send({
				auth: true,
				accessToken: token,
				username: user.username,
				authorities: authorities
			});
		})
	}).catch(err => {
		res.status(500).send({ reason: err.message });
	});
}

exports.userContent = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> User Contents!',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access User Page',
			'error': err
		});
	})
}

exports.adminBoard = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> Admin Contents',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Admin Board',
			'error': err
		});
	})
}

exports.managementBoard = (req, res) => {
	User.findOne({
		where: { id: req.userId },
		attributes: ['username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).send({
			'description': '>>> Project Management Board',
			'user': user
		});
	}).catch(err => {
		res.status(500).send({
			'description': 'Can not access Management Board',
			'error': err
		});
	})
}

exports.numUsers = (req, res) => {
	User.count().then(n => {
		res.send({ numUsers: n });
	});
}

exports.getUserId = (req, res) => {
	User.findOne({
		where: { username: req.body.username },
		attributes: ['id']
	}).then(id => {
		res.send({ userId: id });
	})
}

exports.chatkitUser = (req, res) => {
	chatkit.createUser({
		id: req.body.username,
		name: req.body.username
	})
		.then(() => res.sendStatus(201))
		.catch(error => {
			if (error.error === 'services/chatkit/user_already_exists') {
				res.sendStatus(200)
			} else {
				res.status(error.status).json(error)
			}
		})
}

exports.changePassword = (req, res) => {
	User.findOne({
		where: { email: req.body.email }
	}).then(user => {
		var passwordIsValid = bcrypt.compareSync(encryptor.decrypt(req.body.oldpassword), user.password)
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: 'Invalid Password!' })
		}
		user.updateAttributes({
			password: req.body.newpassword
		})
		res.status(200).send("Updated successfully a user")
	}).catch(err => {
		res.status(500).send({ reason: err.message })
	})
}