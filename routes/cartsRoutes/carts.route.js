const express = require("express");
const app = express();
const {
  addNewCart,
  getAllCarts,
  deleteCart,
  handleQuantity,
} = require("../../controllers/cartsControllers/cartsControllers");
const { verifyJWT } = require("../../middlewares/verifyJWT");

const cartsRouter = express.Router();

cartsRouter.route("/").post(addNewCart).get(verifyJWT,getAllCarts);

cartsRouter.route("/:id").delete(deleteCart).patch(handleQuantity);

module.exports = cartsRouter;
