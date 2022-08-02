const Course   = require('../models/Course');
const Category = require('../models/Category');
const Users    = require('../models/User');

exports.createCourse = async (req, res) => {
	try {
		let course = await Course.create({
			name       : req.body.name,
			description: req.body.description,
			category   : req.body.category,
			user       : req.session.userID
		});
		res.status(201).redirect('/courses');
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};

exports.getAllCourses = async (req, res) => {
	try {
		let categorySlug = req.query.categories;
		let category     = await Category.findOne({slug: categorySlug});

		let filter = {};
		if (categorySlug) {
			filter = {category: category._id};
		}
		let courses    = await Course.find(filter).sort('-createAt');
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
		let courseUser = await Users.findById(course.user);
		res.status(200).render('course-single', {
			course,
			courseUser,
			pageName: "courses"
		});
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};