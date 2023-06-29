const { usersCollection } = require("../../models/database");

const getAllUsers = async (req, res) => {
  try {
    const result = await usersCollection.find({}).toArray();
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

module.exports = { getAllUsers, createUser };
