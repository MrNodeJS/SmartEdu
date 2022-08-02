const Course   = require('../models/Course');
const Category = require('../models/Category');
const User     = require('../models/User');

exports.createCourse = async (req, res) => {
	try {
		let course = await Course.create({
			name       : req.body.name,
			description: req.body.description,
			category   : req.body.category,
			user       : req.session.userID
		});
		req.flash('success', `${course.name} has been created`);
		res.status(201).redirect('/courses');
	} catch (e) {
		req.flash('error', `Something happened!`);
		res.status(400).redirect('/courses');
	}
};

exports.getAllCourses = async (req, res) => {
	try {
		let categorySlug = req.query.categories;
		let query        = req.query.search;

		let category = await Category.findOne({slug: categorySlug});

		let filter = {};
		if (categorySlug) {
			filter = {category: category._id};
		}
		if (query) {
			filter = {name: query};
		}


		if (!query && !categorySlug) {
			filter.name     = "";
			filter.category = null;
		}
		let courses    = await Course.find({
			$or: [
				{
					name: {$regex: '.*' + filter.name + '.*', $options: 'i'}
				},
				{
					category: filter.category
				}
			]
		}).sort('-createAt');
		let categories = await Category.find();
		res.status(200).render('courses', {
			courses,
			categories,
			pageName: "courses"
		});
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};

exports.getCourse = async (req, res) => {
	try {
		let course     = await Course.findOne({slug: req.params.slug});
		let courseUser = await User.findById(course.user);
		let user       = await User.findById(req.session.userID);
		let categories = await Category.find();
		res.status(200).render('course-single', {
			course,
			user,
			courseUser,
			categories,
			pageName: "courses"
		});
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};

exports.enrollCourse = async (req, res) => {
	try {
		const user = await User.findById(req.session.userID);
		await user.courses.push({_id: req.body.course_id});
		await user.save();

		res.status(200).redirect('/users/dashboard');
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			error,
		});
	}
};

exports.releaseCourse = async (req, res) => {
	try {
		const user = await User.findById(req.session.userID);
		await user.courses.pull({_id: req.body.course_id});
		await user.save();

		res.status(200).redirect('/users/dashboard');
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			error,
		});
	}
};