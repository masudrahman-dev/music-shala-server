const { ObjectId } = require("mongodb");
const { usersCollection } = require("../../models/database");

const getAllUsers = async (req, res) => {
  try {
    let result;
    result = await usersCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).send("An error occurred");
  }
};
const createUser = async (req, res) => {
  try {
    const user = req.body;
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
};

const updateUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const newRole = req.body.newRole; // Assuming the newRole value is passed in the request body
    const query = { _id: new ObjectId(id) };
    const update = { $set: { role: newRole } };
    const result = await usersCollection.updateOne(query, update);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating user roles:", error);
    res.status(500).send("An error occurred");
  }
};


const getSingleUser = async (req, res) => {
  try {

    console.log(req.query);
    // const id = req.params.id;
    // const query = { _id: new ObjectId(id) };
    // const result = await usersCollection.updateOne(query);
    // res.status(200).json(result);
  } catch (error) {
    console.error("Error updating user roles:", error);
    res.status(500).send("An error occurred");
  }
};

module.exports = { getAllUsers, createUser, updateUserRole,getSingleUser };
