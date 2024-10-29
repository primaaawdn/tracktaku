const { User } = require("../models");

exports.register = async (req, res, next) => {
	// console.log(req.body);
	const { username, email, password, role } = req.body;

	try {
		const newUser = await User.create({
			username,
			email,
			password,
			role: 'User',
		});

		res.status(201).json(`Welcome, ${newUser.username}`);
	} catch (error) {
		next(error)
	}
};

