const express = require("express");
const {
  getAllClasses,
  createNewClass,
  deleteSingleClass,
  feedback_Status,
} = require("../../controllers/classesControllers/classesControllers");
const app = express();
const classesRouter = express.Router();

//start classes api ###############################################################

classesRouter.route("/").get(getAllClasses).post(createNewClass);

classesRouter.route("/:id").delete(deleteSingleClass).patch(feedback_Status).put( async (req, res) => {
  try {
    const id = req.params.id;  const [currentTab, setCurrentTab] = useState("all");
    const updatedDocs = req.body;
    const query = { _id: new ObjectId(id) };
    const result = await classesCollection.updateOne(query, {
      $set: updatedDocs,
    });
 
    res.status(200).send(result);
  } catch (error) {
    console.error("Error updating class status:", error);
    res.status(500).send("An error occurred");
  }
});

module.exports = classesRouter;
