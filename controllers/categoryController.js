const Category         = require("../models/Category");
exports.createCategory = async (req, res) => {
	try {
		let category = await Category.create(req.body);
		res.status(201).redirect('/users/dashboard');
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};

exports.deleteCategory = async (req, res) => {
	try {
		await Category.findByIdAndRemove(req.params.id);
		res.status(200).redirect('/users/dashboard');
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};