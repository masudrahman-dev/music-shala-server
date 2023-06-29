const { ObjectId } = require("mongodb");
const { classesCollection } = require("../../models/database");

const getAllClasses = async (req, res) => {
  try {
    const result = await classesCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).send("An error occurred");
  }
};

const createNewClass = async (req, res) => {
  try {
    const data = req.body;
    const result = await classesCollection.insertOne(data);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error inserting class:", error);
    res.status(500).send("An error occurred");
  }
};

const deleteSingleClass = async (req, res) => {
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
};

const deniedFeedback = async (req, res) => {
  try {
    const classId = req.params.id;
    const newDesc = req.body.description;
    const query = { _id: new ObjectId(classId) };
    const result = await classesCollection.updateOne(query, {
      $set: { description: newDesc },
    });
    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating class status:", error);
    res.status(500).send("An error occurred");
  }
};
module.exports = {
  getAllClasses,
  createNewClass,
  deleteSingleClass,
  deniedFeedback,
};
