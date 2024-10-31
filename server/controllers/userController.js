const { User } = require("../models");
const bcrypt = require("bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

exports.register = async (req, res, next) => {
	// console.log(req.body);
	const { username, email, password } = req.body;

	try {
		const newUser = await User.create({
			username,
			email,
			password,
		});

		res.status(201).json(`Welcome, ${newUser.username}`);
	} catch (error) {
		if (error.name === "SequelizeUniqueConstraintError") {
			return res.status(400).json({ message: "Email is taken" });
		}
		next(error);
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		// console.log(password, "login user controller");

		if (!email) {
			next({ name: "BadRequest", message: `Email is required` });
			return;
		}

		if (!password) {
			next({ name: "BadRequest", message: `Password is required` });
			return;
		}

		const user = await User.findOne({ where: { email } });

		if (!user) {
			next({ name: "Unauthorized", message: `Invalid email` });
			return;
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			next({ name: "Unauthorized", message: "Invalid password" });
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

exports.googleLogin = async (req, res, next) => {
	try {
		const token = req.headers.access_token;
		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
		const payload = ticket.getPayload();
		const [user, created] = await User.findOrCreate({
			where: {
				email: payload.email,
			},
			defaults: {
				username: payload.given_name,
				email: payload.email,
				password: "password-google",
			},
			hooks: false,
		});
		const accessToken = signToken({
			id: user.id,
			username: user.username,
			email: user.email,
		});
		res.status(200).json({ access_token: accessToken });
	} catch (error) {
		next(error);
	}
};

exports.getUserById = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.user.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		  }
		  res.status(200).json({ data: user });
	} catch (error) {
		next(error);
	}
};

exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.findAll();
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

exports.deleteUser = async (req, res, next) => {
	try {
		const id = parseInt(req.params.id);
		const user = await User.findByPk(id);
		if (!user) {
			next({ name: "NotFound", message: `User with id:${id} not found` });
			return;
		}

		await user.destroy();
		res.status(200).json({ message: `User deleted successfully` });
	} catch (error) {}
};

exports.updateUser = async (req, res, next) => {
	try {
		const id = parseInt(req.params.id);
		const user = await User.findByPk(id);

		if (!user) {
			next({ name: "NotFound", message: `User with id:${id} not found` });
			return;
		}

		await User.update(req.body, { where: { id: id } });

		res
			.status(200)
			.json({ message: `Great! You have successfully updated your profile.` });
	} catch (error) {
		next(error);
	}
};
