const express = require("express");
const { usersCollection } = require("../../models/database");
const app = express();
const usersRouter = express.Router();

// users ##############################################################################
// usersRouter.post("/create-payment-intent", async (req, res) => {
//     const { price } = req.body;
//     const amount = parseInt(price * 100);
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   });

// get all users
usersRouter.get("/users", async (req, res) => {
  try {
    const result = await usersCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).send("An error occurred");
  }
});
// create users
usersRouter.post("/users", async (req, res) => {
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
usersRouter.patch("/users/user-role", async (req, res) => {
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

module.exports = usersRouter;
