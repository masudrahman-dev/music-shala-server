const express = require("express");
const { usersCollection } = require("../../models/database");
const {
  getAllUsers,
  createUser,
} = require("../../controllers/usersControllers/usersControllers");
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
usersRouter.route("/").get(getAllUsers).post(createUser);

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
