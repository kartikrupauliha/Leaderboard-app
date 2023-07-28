const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const cookieparser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieparser());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const assignmentsRouter = require("./routes/assignments");
const authRoute = require("./routes/AuthRoute");
const cookieParser = require("cookie-parser");

app.use("/", assignmentsRouter);

app.use("/", authRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

