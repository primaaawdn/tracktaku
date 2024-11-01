if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const cors = require('cors');
const app = express();
// const port = 3000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { errorhandler } = require("./middlewares/errorhandler");

const userRoutes = require("./routers/userRoutes");
const readingListRoutes = require("./routers/readingListRoutes");

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use("/user", userRoutes);
app.use("/manga", readingListRoutes);

app.use(errorhandler);

// app.listen(port, () => {
// 	console.log(`Server running on port ${port}`);
// });

module.exports = app;