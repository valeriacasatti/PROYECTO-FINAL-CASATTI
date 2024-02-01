import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { checkRole, isAuth } from "../middlewares/auth.js";
import passport from "passport";

const router = Router();

//get all carts
router.get("/", CartsController.getCarts);

//add cart
router.post("/", CartsController.addCart);

//get cart id
router.get("/:cid", CartsController.getCartById);

//delete cart
router.delete("/:cid", CartsController.deleteCart);

//agregar productos al arreglo del carrito seleccionado (solo users)
router.post(
  "/:cid/products/:pid",
  isAuth,
  checkRole(["user"]),
  CartsController.addProduct
);

//eliminar product del cart
router.delete(
  "/:cid/products/:pid",
  isAuth,
  checkRole(["user"]),
  CartsController.deleteProductCart
);

//actualizar quantity del product en el cart
router.put("/:cid/products/:pid", CartsController.updateProductCart);

//purchase
router.post(
  "/:cid/purchase",
  passport.authenticate("jwtAuth", {
    session: false,
    failureRedirect: "/api/sessions/fail-auth",
  }),
  CartsController.purchaseCart
);

export { router as cartsRouter };
