const { ObjectId } = require("mongodb");
const { cartsCollection, classesCollection } = require("../../models/database");

const addNewCart = async (req, res) => {
  try {
    const data = req.body;
    const id = data.classId;
    const query = { _id: new ObjectId(id) };
    if (data.classId) {
      const result2 = await classesCollection.findOne(query);
      const available_seats = parseFloat(result2.seats) - 1;
      const result3 = await classesCollection.updateOne(query, {
        $set: { seats: available_seats },
      });
    }
    const result = await cartsCollection.insertOne(data);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error inserting class:", error);
    res.status(500).send("An error occurred");
  }
};
const getAllCarts = async (req, res) => {
  try {
    const email = req.query.email;
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
    //  (id);
    // const query = {
    //   $or: [
    //     { _id: { $regex: id, $options: "i" } },
    //     { _id: new ObjectId(id) },
    //   ],
    // };
    const query = { _id: new ObjectId(id) };
    const result = await cartsCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = { addNewCart, getAllCarts, deleteCart };
