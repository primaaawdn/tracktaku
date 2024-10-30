if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { errorHandler } = require("./middlewares/errorHandler");

const userRoutes = require("./routers/userRoutes");
const mangaRoutes = require("./routers/mangaRoutes");

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use("/user", userRoutes);
app.use("/manga", mangaRoutes);

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

module.exports = app;