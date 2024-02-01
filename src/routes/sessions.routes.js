import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";
import { SessionsController } from "../controllers/sessions.controller.js";
import { userUpload } from "../utils.js";

const router = Router();

//sign up
router.post(
  "/signup",
  userUpload.single("avatar"),
  passport.authenticate("signupLocalStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-signup",
  }),
  SessionsController.signup
);

//fail signup
router.get("/fail-signup", SessionsController.failSignup);

//log in
router.post(
  "/login",
  passport.authenticate("loginLocalStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-login",
  }),
  SessionsController.login
);

//fail login
router.get("/fail-login", SessionsController.failLogin);

//forgot password
router.post("/forgot-password", SessionsController.forgotPassword);

//reset password
router.post("/reset-password", SessionsController.resetPassword);

//sign up with github
router.get(
  config.github.callbackURL,
  passport.authenticate("signupGithubStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-signup",
  }),
  SessionsController.signupGithub
);
router.get(
  "/signup-github",
  userUpload.single("avatar"),
  passport.authenticate("signupGithubStrategy")
);

//log in up with github
router.get("/login-github", passport.authenticate("loginGithubStrategy"));
router.get(
  config.github.callbackURL,
  passport.authenticate("loginGithubStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-login",
  }),
  SessionsController.loginGithub
);

//profile
router.post(
  "/profile",
  passport.authenticate("jwtAuth", {
    session: false,
    failureRedirect: "/api/sessions/fail-auth",
  }),
  SessionsController.profile
);

//fail auth
router.get("/fail-auth", SessionsController.failAuth);

//logout
router.get(
  "/logout",
  passport.authenticate("jwtAuth", {
    session: false,
    failureRedirect: "/api/sessions/fail-auth",
  }),
  SessionsController.logout
);

export { router as sessionsRouter };
