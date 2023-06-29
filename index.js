const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const bodyParser = require("body-parser");
const classesRouter = require("./routes/classesRoutes/classes.route");
const cartsRouter = require("./routes/cartsRoutes/cartas.route");
const usersRouter = require("./routes/usersRoutes/users.route");

const app = express();
const port = process.env.PORT || 5000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());

// get all classes
app.use("/classes", classesRouter);
app.use("/carts", cartsRouter);
app.use("/users", usersRouter);

// await client.close();
app.get("/", async (req, res) => {
  res.send(`<h1>Server is Running...</h1>`);
});
app.listen(port, () => {
  `Example app listening on http://localhost:${port}`;
});
