import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { checkRole, isAuth } from "../middlewares/auth.js";
import passport from "passport";

const router = Router();

//get products
router.get("/", ProductsController.getProducts);

//add product
router.post(
  "/",
  isAuth,
  checkRole(["admin", "premium"]),
  passport.authenticate("jwtAuth", {
    session: false,
    failureRedirect: "/api/sessions/fail-auth",
  }),
  ProductsController.addProduct
);

//get product by id
router.get("/:pid", ProductsController.getProductById);

//update product
router.put(
  "/:pid",
  isAuth,
  checkRole(["admin", "premium"]),
  ProductsController.updateProduct
);
//delete product
router.delete(
  "/:pid",
  isAuth,
  checkRole(["admin", "premium"]),
  ProductsController.deleteProduct
);

export { router as productsRouter };
