const express = require("express");
const app = express();
const {
  addNewCart,
  getAllCarts,
  deleteCart,
} = require("../../controllers/cartsControllers/cartsControllers");

const cartsRouter = express.Router();

cartsRouter.route("/").post(addNewCart).get(getAllCarts);

cartsRouter.delete("/:id", deleteCart);

module.exports = cartsRouter;
