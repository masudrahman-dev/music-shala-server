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

    // // carts collection

    // classes collection related api
    // get six items
    app.get("/classes/six-item", async (req, res) => {
      try {
        const result = await classCollection.find().limit(6).toArray();
        res.status(200).send(result);
      } catch (error) {
        console.error("Error retrieving items:", error);
        res.status(500).send("An error occurred");
      }
    });

    // all classes items
    app.get("/classes", async (req, res) => {
      try {
        const result = await classCollection.find({}).toArray();

        if (result) {
          res.send(result);
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send("An error occurred");
      }
    });
    // get logged user  classes items
    app.get("/classes/logged-user", async (req, res) => {
      try {
        const query = req.query.searchQuery;
        console.log(query);
        const result = await classCollection
          .find({ user_email: query })
          .toArray();

        if (result) {
          res.send(result);
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send("An error occurred");
      }
    });
    
    //  update class status
    app.patch("/classes/class-status", async (req, res) => {
      const classId = req.query.classId;
      const updatedStatus = req.query.newStatus;
      try {
        const result = await classCollection.updateOne(
          { _id: new ObjectId(classId) },
          {
            $set: { status: updatedStatus },
          }
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

    // update user role to classes DB
    app.patch("/classes/update-user-role", async (req, res) => {
      const email = req.query.email;
      const updatedRole = req.query.newRole;
      // console.log(email, updatedRole);

      try {
        const result = await classCollection.updateMany(
          { user_email: email },
          {
            $set: { role: updatedRole },
          }
        );
        console.log(result);
        if (result.modifiedCount > 0) {
          res.send("Update successful");
        } else {
          res.status(404).send("No matching users found");
        }
      } catch (error) {
        console.error("Error updating users:", error);
        res.status(500).send("An error occurred");
      }
    });

    // // test
    // // ###################################################
    // //  update class info
    app.patch("/classes/update-info/:id", async (req, res) => {
      const classId = req.params.id;
      const updatedClassInfo = req.body;
      console.log(req.params);
      console.log(updatedClassInfo);

      try {
        const result = await classCollection.updateOne(
          { _id: new ObjectId(classId) },
          {
            $set: updatedClassInfo,
          }
        );

        if (result.modifiedCount === 1) {
          res.send(" successful feedback update");
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred");
      }
    });

    //  delete class
    app.delete("/classes/my-class/:classId", async (req, res) => {
      const classId = req.params.classId;

      try {
        // Find and delete the class document
        const result = await classCollection.deleteOne({
          _id: new ObjectId(classId),
        });

        if (result.deletedCount === 1) {
          res.send("Class deleted successfully");
        } else {
          res.status(404).send("Class not found");
        }
      } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).send("An error occurred");
      }
    });

    //  update description
    app.patch("/classes/feedback", async (req, res) => {
      const classId = req.query.classId;
      const updatedDesc = req.query.newDesc;

      try {
        const result = await classCollection.updateOne(
          { _id: new ObjectId(classId) },
          {
            $set: { description: updatedDesc },
          }
        );

        if (result.modifiedCount === 1) {
          res.send(" successful feedback update");
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("An error occurred");
      }
    });

    // get  carts/logged-user
    app.get("/carts/logged-user", async (req, res) => {
      try {
        const query = req.query.searchQuery;
        // console.log(query);
        const result = await cartsCollection
          .find({ user_email: query })
          .toArray();

        if (result) {
          res.send(result);
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).send("An error occurred");
      }
    });

    // add class to cart
    app.post("/carts", async (req, res) => {
      try {
        const newItem = req.body;
        const result = await cartsCollection.insertOne(newItem);

        res.send(result);
      } catch (error) {
        console.error("Error adding class:", error);
        res.status(500).send("An error occurred");
      }
    });
    // delete class to cart
    app.delete("/carts/:id", async (req, res) => {
      try {
        const classId = req.params.id;
        // console.log(req.params.id);
        const result = await cartsCollection.deleteOne({
          _id: new ObjectId(classId),
        });
        // console.log(result);
        if (result.deletedCount > 0) {
          res.status(200).send(result);
        } else {
          res.status(404).json({ success: false, message: "Item not found" });
        }
      } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).send("An error occurred");
      }
    });

    // // instructors related api
    // add class
    app.post("/add-class", async (req, res) => {
      try {
        const newItem = req.body;
        const result = await classCollection.insertOne(newItem);

        res.send(result);
      } catch (error) {
        console.error("Error adding class:", error);
        res.status(500).send("An error occurred");
      }
    });

    // get all users data
    app.get("/users", async (req, res) => {
      try {
        const result = await usersCollection.find({}).toArray();
        res.status(200).json(result);
      } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).send("An error occurred");
      }
    });

    // create user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      // console.log(user);

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // update user role to user DB
    app.patch("/users/update-role", async (req, res) => {
      const userId = req.query.userId;
      const updatedValue = req.query.newRole;
      try {
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: { role: updatedValue },
          }
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
