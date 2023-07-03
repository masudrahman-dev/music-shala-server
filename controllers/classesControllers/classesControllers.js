const { ObjectId } = require("mongodb");
const { classesCollection } = require("../../models/database");

// const getAllClasses = async (req, res) => {
//   try {
//     let result=[];
//     const { email, status, currentTab } = req.query;
//     // console.log(req.query);
//     console.log(currentTab);
//     if (email) {
//       const emailQuery = { instructor_email: email };
//       result = await classesCollection.find(emailQuery).toArray();
//     } else if (status) {
//       const statusQuery = { status: status };
//       result = await classesCollection.find(statusQuery).toArray();
//     } else {

//       result = await classesCollection.find().toArray();
//     }

//     res.status(200).json(result); // Send response as JSON
//   } catch (error) {
//     console.error("Error retrieving items:", error);
//     res.status(500).send("An error occurred");
//   }
// };
// const getAllClasses = async (req, res) => {
//   try {
//     const { email, status, currentTab } = req.query;

//     let pipeline = [];

//     if (email) {
//       pipeline.push({ $match: { instructor_email: email } });
//     } else if (status && currentTab) {
//       pipeline.push({ $match: { status: status, currentTab: currentTab } });
//     }

//     pipeline.push({ $project: { _id: 0 } });

//     const result = await classesCollection.aggregate(pipeline).toArray();

//     res.status(200).json(result); // Send response as JSON
//   } catch (error) {
//     console.error("Error retrieving items:", error);
//     res.status(500).send("An error occurred");
//   }
// };
const getAllClasses = async (req, res) => {
  try {
    let result = [];
    const { email, status, currentTab } = req.query;
    console.log(currentTab);

    if (email) {
      const emailQuery = { instructor_email: email };
      result = await classesCollection.find(emailQuery).toArray();
    } else if (status) {
      if (currentTab !== "all") {
        const statusQuery = { status: status, category: currentTab };
        result = await classesCollection.find(statusQuery).toArray();
      } else {
        const statusQuery = { status: status };
        result = await classesCollection.find(statusQuery).toArray();
      }
    } else {
      result = await classesCollection.find({}).toArray();
    }

    res.status(200).json(result); // Send response as JSON
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
// feedback update status
const feedback_Status = async (req, res) => {
  try {
    let result;
    const classId = req.params.id;
    const updatedStatus = req.body.newStatus;
    const updatedFeedback = req.body.description;
    const updatedDocs = req.body;
    // console.log(updatedDocs);
    const query = { _id: new ObjectId(classId) };
    // console.log(updatedFeedback, updatedStatus);
    if (updatedStatus) {
      result = await classesCollection.updateOne(query, {
        $set: { status: updatedStatus },
      });
    } else if (updatedFeedback) {
      result = await classesCollection.updateOne(query, {
        $set: { description: updatedFeedback },
      });
    }
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
  feedback_Status,
};
