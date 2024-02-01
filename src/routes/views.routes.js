import { Router } from "express";
import { ViewsController } from "../controllers/views.controller.js";
import passport from "passport";

const router = Router();

//home
router.get("/", ViewsController.home);
//shop
router.get("/shop", ViewsController.shop);
//cart
router.get(
  "/cart",
  passport.authenticate("jwtAuth", {
    session: false,
    failureRedirect: "/api/sessions/fail-auth",
  }),
  ViewsController.cart
);
//sign up
router.get("/signup", ViewsController.signup);
//login
router.get("/login", ViewsController.login);
//profile
router.get("/profile", ViewsController.profile);
//forgot password
router.get("/forgot-password", ViewsController.forgotPassword);
//reset password
router.get("/reset-password", ViewsController.resetPassword);

export { router as viewsRouter };
