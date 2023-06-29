const express = require("express");
const { cartsCollection } = require("../../models/database");
const app = express();
const cartsRouter = express.Router();

// add to carts
cartsRouter.post("/carts", async (req, res) => {
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
cartsRouter.get("/carts", async (req, res) => {
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
cartsRouter.delete("/carts/:id", async (req, res) => {
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

module.exports = cartsRouter;
