const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const {hash}   = require("bcrypt");
const Schema   = mongoose.Schema;


const UserSchema = new Schema({
	name    : {
		type   : String,
		require: true
	},
	email   : {
		type   : String,
		require: true,
		unique : true
	},
	password: {
		type   : String,
		require: true
	},
	role    : {
		type   : String,
		enum   : ["student", "teacher", "admin"],
		default: "student"
	}
});

UserSchema.pre('save', function (next) {
	const user = this;
	bcrypt.hash(user.password, 10, (error, hash) => {
		user.password = hash;
		next();
	});
});

const User     = mongoose.model('UserSchema', UserSchema);
module.exports = User;