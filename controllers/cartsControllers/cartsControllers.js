const { ObjectId } = require("mongodb");
const { cartsCollection, classesCollection } = require("../../models/database");

const addNewCart = async (req, res) => {
  try {
    const data = req.body;
    const id = data.classId;
    const query = { classId: id };
    let result;
    result = await cartsCollection.findOne(query);
    if (result) {
      let quantity = parseInt(result.quantity);
      let totalPrice = result.totalPrice;
      quantity = quantity + 1;
      totalPrice = totalPrice + parseInt(result.price);
      const updatedDocs = {
        $set: { quantity: quantity, totalPrice: totalPrice },
      };
      result = await cartsCollection.updateOne(query, updatedDocs);
    } else {
      data.quantity = 1;
      data.totalPrice = parseInt(data.price);
      result = await cartsCollection.insertOne(data);
    }

    res.status(200).send(result);
  } catch (error) {
    console.error("Error inserting class:", error);
    res.status(500).send("An error occurred");
  }
};
const getAllCarts = async (req, res) => {
  try {

    const email = req.query.email;
    if (email !== req.decoded.email) {
      return res.status(403).send({ error: 1, message: "forbidden access" });
    }
    const query = { customer_email: email };
    const result = await cartsCollection.find(query).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error inserting class:", error);
    res.status(500).send("An error occurred");
  }
};

const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await cartsCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("An error occurred");
  }
};

const handleQuantity = async (req, res) => {
  try {
    const id = req.params.id;
    const operator = req.body.plusOrMinus;
    const query = { _id: new ObjectId(id) };
    let result;
    result = await cartsCollection.findOne(query);
    let quantity = result.quantity;
    let totalPrice = result.totalPrice;

    if (operator === "+") {
      quantity = quantity + 1;
      totalPrice = totalPrice + parseInt(result.price);
    } else if (operator === "-") {
      quantity = quantity - 1;
      totalPrice = totalPrice - parseInt(result.price);
    }
    const updatedDocs = {
      $set: { quantity: quantity, totalPrice: totalPrice },
    };
    result = await cartsCollection.updateOne(query, updatedDocs);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = { addNewCart, getAllCarts, deleteCart, handleQuantity };
