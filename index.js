const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// routes dependencies
const classesRouter = require("./routes/classesRoutes/classes.route");
const cartsRouter = require("./routes/cartsRoutes/carts.route");
const usersRouter = require("./routes/usersRoutes/users.route");
const { createToken } = require("./controllers/jwtControllers/jwtControllers");

// routes

app.post("/jwt", createToken);
app.use("/classes", classesRouter);
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);

app.get("/", async (req, res) => {
  res.send(`<h1>Server is Running...</h1>`);
});
app.listen(port, () => {
  `Example app listening on http://localhost:${port}`;
});
