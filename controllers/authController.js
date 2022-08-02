const bcrypt   = require('bcrypt');
const User     = require("../models/User");
const Category = require("../models/Category");
const Course   = require('../models/Course');

exports.createUser = async (req, res) => {
	try {
		let user = await User.create(req.body);
		res.status(201).redirect('/login');
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};
exports.loginUser  = async (req, res) => {
	try {
		let {email, password} = req.body;
		let user              = await User.findOne({email});
		if (user) {
			bcrypt.compare(password, user.password, (err, same) => {
				req.session.userID = user._id;
				res.status(200).redirect('/users/dashboard');
			});
		}
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};

exports.getDashboardPage = async (req, res) => {
	let user       = await User.findOne({_id: req.session.userID}).populate('courses');
	let categories = await Category.find();
	let courses    = await Course.find({user: req.session.userID});
	res.status(200).render('dashboard', {
		pageName: 'dashboard',
		user,
		categories,
		courses
	});
};

exports.logoutUser = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};