const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const port = 5000 || process.env.PORT;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
// require('crypto').randomBytes(64).toString('hex')
const { MongoClient, ServerApiVersion } = require("mongodb");

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ocgiioi.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjny6cg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// const verifyJWT = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (!authorization) {
//     return res
//       .status(401)
//       .send({ error: true, message: "unauthorized access" });
//   }
//   // bearer token
//   const token = authorization.split(" ")[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       return res
//         .status(401)
//         .send({ error: true, message: "unauthorized access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// };

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
   

  } finally {
    // Ensures that the client will close when you finish/error
    app.get("/", async (req, res) => {
      res.send(`<h1>Server is Running</h1>`);
    });
    ("Pinged your deployment. You successfully connected to MongoDB!");
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  `Example app listening on http://localhost:${port}`;
});
