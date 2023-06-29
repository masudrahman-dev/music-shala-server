const express = require("express");
const {
  getAllClasses,
  createNewClass,
  deleteSingleClass,
  deniedFeedback,
} = require("../../controllers/classesControllers/classesControllers");
const app = express();
const classesRouter = express.Router();

//start classes api ###############################################################

classesRouter.route("/").get(getAllClasses).post(createNewClass);

classesRouter.route("/:id").delete(deleteSingleClass).patch(deniedFeedback);

// update class  status
classesRouter.patch("/classes/update-status", async (req, res) => {
  try {
    const classId = req.query.classId;
    const newStatus = req.query.newStatus;

    const query = { _id: new ObjectId(classId) };
    //  (classId, newStatus, query);

    const result = await classesCollection.updateOne(query, {
      $set: { status: newStatus },
    });

    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating class status:", error);
    res.status(500).send("An error occurred");
  }
});

// update class  feedback
// classesRouter.patch("/classes/feedback", async (req, res) => {
//   try {
//     const classId = req.query.classId;
//     const newDesc = req.query.newDesc;
//     //  (classId, newDesc);
//     const query = { _id: new ObjectId(classId) };
//     //  (classId, newStatus, query);

//     const result = await classesCollection.updateOne(query, {
//       $set: { description: newDesc },
//     });
//     //  (result);
//     res.status(200).send(result);
//   } catch (error) {
//     console.error("Error updating class status:", error);
//     res.status(500).send("An error occurred");
//   }
// });
// decrement available seats
classesRouter.patch("/classes/decrement-seats/:id", async (req, res) => {
  try {
    const classId = req.params.id;
    //  (classId);

    const query = { _id: new ObjectId(classId) };
    //  (classId, newStatus, query);
    const result2 = await classesCollection.findOne(query);
    const available_seats = parseFloat(result2.seats) - 1;
    if (parseInt(result2.seats) > 0) {
      //  (available_seats);
      //  (result2);
      const result = await classesCollection.updateOne(query, {
        $set: { seats: available_seats },
      });
      //  (result);
      res.status(200).send(result);
    }
  } catch (error) {
    console.error("Error updating class status:", error);
    res.status(500).send("An error occurred");
  }
});
// update class info
classesRouter.put("/classes/update-info/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedDocs = req.body;
    const query = { _id: new ObjectId(id) };
    const result = await classesCollection.updateOne(query, {
      $set: updatedDocs,
    });
    //  (result);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating class status:", error);
    res.status(500).send("An error occurred");
  }
});

module.exports = classesRouter;
