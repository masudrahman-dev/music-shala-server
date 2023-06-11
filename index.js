const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const bodyParser = require("body-parser");
const app = express();
const port = 5000 || process.env.PORT;
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    const classCollection = client.db("summer-camp-db").collection("classes");
    const cartsCollection = client.db("summer-camp-db").collection("carts");
    const usersCollection = client.db("summer-camp-db").collection("users");

    // instructors related api

    app.post("/add-class", async (req, res) => {
      const item = req.body;

      const result = await classCollection.insertOne(item);
      res.send(result);
    });

    app.get("/add-class", async (req, res) => {
      const result = await classCollection.find({}).toArray();
      res.send(result);
    });
    // user api

    app.post("/users", async (req, res) => {
      const user = req.body;
      // const query = { email: user.email }
      // const existingUser = await usersCollection.findOne(query);

      // if (existingUser) {
      //   return res.send({ message: 'user already exists' })
      // }clo
      console.log(user);

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      // console.log(user);

      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });
    // patch
    app.patch("/users/", async (req, res) => {
      // console.log(req.query.userId);
      const userId = req.query.userId;
      const updatedValue = req.query.newRole;
      console.log(userId, updatedValue);
      try {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { role: updatedValue } }
        );

        if (result.modifiedCount === 1) {
          res.send("Update successful");
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred");
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    app.get("/", async (req, res) => {
      res.send(`<h1>Server is Running</h1>`);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
