const Category         = require("../models/Category");
exports.createCategory = async (req, res) => {
	try {
		let category = await Category.create(req.body);
		res.status(201).json({
			status: 'success',
			category
		});
	} catch (e) {
		res.status(400).json({
			status: 'Error',
			e
		});
	}
};