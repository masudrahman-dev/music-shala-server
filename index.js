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
// This is your test secret API key.
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = `mongodb+srv://masudrahmandev:${process.env.DB_PASS}@cluster0.uxgns2h.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abghlrw.mongodb.net/?retryWrites=true&w=majority`;

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

    const classesCollection = client.db("music-shala-db").collection("classes");
    const cartsCollection = client.db("music-shala-db").collection("carts");
    const usersCollection = client.db("music-shala-db").collection("users");
    //start classes api ###############################################################
    //get six class item
    app.get("/classes/six-item", async (req, res) => {
      try {
        const result = await classesCollection.find().limit(6).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error retrieving items:", error);
        res.status(500).send("An error occurred");
      }
    });
    // get all classes
    app.get("/classes", async (req, res) => {
      try {
        const result = await classesCollection.find({}).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error retrieving items:", error);
        res.status(500).send("An error occurred");
      }
    });

    // add class to post
    app.post("/classes", async (req, res) => {
      try {
        const data = req.body;
        const result = await classesCollection.insertOne(data);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error inserting class:", error);
        res.status(500).send("An error occurred");
      }
    });
    // delete from my-class
    app.delete("/classes/:id", async (req, res) => {
      try {
        const id = req.params.id;
        //  (id);
        const query = { _id: new ObjectId(id) };
        const result = await classesCollection.deleteOne(query);
        //  (result);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("An error occurred");
      }
    });
    // update class  status
    app.patch("/classes/update-status", async (req, res) => {
      try {
        const classId = req.query.classId;
        const newStatus = req.query.newStatus;

        const query = { _id: new ObjectId(classId) };
        //  (classId, newStatus, query);

        const result = await classesCollection.updateOne(query, {
          $set: { status: newStatus },
        });

        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating class status:", error);
        res.status(500).send("An error occurred");
      }
    });
    // update class  feedback
    app.patch("/classes/feedback", async (req, res) => {
      try {
        const classId = req.query.classId;
        const newDesc = req.query.newDesc;
        //  (classId, newDesc);
        const query = { _id: new ObjectId(classId) };
        //  (classId, newStatus, query);

        const result = await classesCollection.updateOne(query, {
          $set: { description: newDesc },
        });
        //  (result);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating class status:", error);
        res.status(500).send("An error occurred");
      }
    });
    // decrement available seats
    app.patch("/classes/decrement-seats/:id", async (req, res) => {
      try {
        const classId = req.params.id;
        //  (classId);

        const query = { _id: new ObjectId(classId) };
        //  (classId, newStatus, query);
        const result2 = await classesCollection.findOne(query);
        const available_seats = parseFloat(result2.seats) - 1;
        if (parseInt(result2.seats) > 0) {
          //  (available_seats);
          //  (result2);
          const result = await classesCollection.updateOne(query, {
            $set: { seats: available_seats },
          });
          //  (result);
          res.status(200).send(result);
        }
      } catch (error) {
        console.error("Error updating class status:", error);
        res.status(500).send("An error occurred");
      }
    });
    // update class info
    app.put("/classes/update-info/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedDocs = req.body;
        const query = { _id: new ObjectId(id) };
        const result = await classesCollection.updateOne(query, {
          $set: updatedDocs,
        });
        //  (result);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating class status:", error);
        res.status(500).send("An error occurred");
      }
    });

    //carts api #####################################################################
    // add to carts
    app.post("/carts", async (req, res) => {
      try {
        const data = req.body;
        const result = await cartsCollection.insertOne(data);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error inserting class:", error);
        res.status(500).send("An error occurred");
      }
    });
    // get all carts
    app.get("/carts", async (req, res) => {
      try {
        const email = req.query.email;
        const query = { customer_email: email };
        const result = await cartsCollection.find(query).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error inserting class:", error);
        res.status(500).send("An error occurred");
      }
    });
    // delete carts
    app.delete("/carts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        //  (id);
        // const query = {
        //   $or: [
        //     { _id: { $regex: id, $options: "i" } },
        //     { _id: new ObjectId(id) },
        //   ],
        // };
        const query = { _id: new ObjectId(id) };
        const result = await cartsCollection.deleteOne(query);
        //  (result);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send("An error occurred");
      }
    });

    // users ##############################################################################
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    // get all users
    app.get("/users", async (req, res) => {
      try {
        const result = await usersCollection.find({}).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error retrieving items:", error);
        res.status(500).send("An error occurred");
      }
    });
    // create users
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        user;
        const query = {
          email: user.email,
        };
        // Check if user already exists
        const existingUser = await usersCollection.findOne(query);

        if (existingUser) {
          // User already exists, handle accordingly
          "User already exists:", existingUser;
          res.status(400).send("User already exists");
          return;
        }

        // User does not exist, insert user data
        const result = await usersCollection.insertOne(user);
        res.status(200).send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send("An error occurred");
      }
    });

    // update users role
    app.patch("/users/user-role", async (req, res) => {
      try {
        const { email, newRole } = req.query;
        //  (email, newRole);

        const result = await usersCollection.updateMany(
          { email },
          { $set: { role: newRole } }
        );

        res.status(200).send(result);
      } catch (error) {
        console.error("Error updating user roles:", error);
        res.status(500).send("An error occurred");
      }
    });

    ("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
    app.get("/", async (req, res) => {
      res.send(`<h1>Server is Running...</h1>`);
    });
    app.listen(port, () => {
      `Example app listening on http://localhost:${port}`;
    });
  }
}
run().catch(console.dir);
