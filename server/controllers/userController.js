const { User } = require("../models");
const bcrypt = require("bcrypt");
const { signToken } = require("../helpers/jwt");

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

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		// console.log(password, "login user controller");

		if(!email) {
			next ({ name: "BadRequest", message: `Email is required` });
			return;
		}

		if(!password) {
			next ({ name: "BadRequest", message: `Password is required` });
			return;
		}
	
		const user = await User.findOne({ where: { email }});

		if (!user) {
			next ({ name: "Unauthorized", message: `Invalid email` });
			return;
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			next ({ name: "Unauthorized", message: "Invalid password" });
			return;
		}

		const access_token = signToken({ id: user.id });
		// console.log("Generated access token:", access_token);
		res.status(200).json({ access_token });
	} catch (error) {
		// console.error(error);
        next(error);
	}
};

exports.getAllUsers = async (req, res,next) => {
	try {
		const users = await User.findAll();
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
}