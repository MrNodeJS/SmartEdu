const bcrypt             = require('bcrypt');
const User               = require("../models/User");
const Category           = require("../models/Category");
const Course             = require('../models/Course');
const {validationResult} = require("express-validator");

exports.createUser = async (req, res) => {
	try {
		let user = await User.create(req.body);
		res.status(201).redirect('/login');
	} catch (e) {
		const errors = validationResult(req);
		for (let i = 0; i < errors.array().length; i++)
			req.flash('error', `${errors.array()[i].msg}`);

		res.status(400).redirect('/register');
	}
};
exports.loginUser  = async (req, res) => {
	try {
		let {email, password} = req.body;
		let user              = await User.findOne({email});
		if (user) {
			bcrypt.compare(password, user.password, (err, same) => {
				if (same) {
					req.session.userID = user._id;
					res.status(200).redirect('/users/dashboard');
				} else {
					req.flash('error', "Your password is not correct!");
					res.status(400).redirect('/login');
				}
			});
		} else {
			req.flash('error', "User is not exist!");
			res.status(400).redirect('/login');
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
	let users      = await User.find();
	res.status(200).render('dashboard', {
		pageName: 'dashboard',
		user,
		users,
		categories,
		courses
	});
};

exports.logoutUser = (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
};

exports.deleteUser = async (req, res) => {
	try {
		await User.findByIdAndRemove(req.params.id);
		await Course.deleteMany({user: req.params.id});

		res.status(200).redirect('/users/dashboard');
	} catch (e) {
		res.status(400).json({
			status: 'error',
			e,
		});
	}
};
exports.delete     = async (req, res) => {
	try {
		await User.findByIdAndRemove(req.params.id);
		await Course.deleteMany({user: req.params.id});

		res.status(200).redirect('/users/dashboard');
	} catch (e) {
		res.status(400).json({
			status: 'error',
			e,
		});
	}
};