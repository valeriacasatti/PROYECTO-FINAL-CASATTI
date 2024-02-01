import { createHash, generateToken } from "../utils.js";
import { CustomError } from "../services/errors/customError.service.js";
import {
  authError,
  loginError,
} from "../services/errors/createError.service.js";
import { Error } from "../enums/Error.js";
import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";
import {
  generateEmailToken,
  sendChangePasswordEmail,
  verifyEmailToken,
} from "../helpers/email.js";
import { isValidPassword } from "../utils.js";
import { User } from "../dao/dto/userDto.js";

export class SessionsController {
  //sign up
  static signup = async (req, res) => {
    res.render("login", {
      message: "user created successfully",
      style: "login.css",
    });
  };

  //fail signup
  static failSignup = (req, res) => {
    const signupError = CustomError.createError({
      name: "Sign up error",
      cause: authError(),
      message: authError(),
      code: Error.AUTH_ERROR,
    });
    res.render("signup", {
      error: signupError,
      style: "signup.css",
    });
  };

  //log in
  static login = async (req, res) => {
    const token = generateToken(req.user);
    res
      .cookie("cookieToken", token)
      .json({
        status: "success",
        message: "login successfully",
      })
      .render("profile", { style: "profile.css" });
  };

  //fail login
  static failLogin = (req, res) => {
    const errorLogin = CustomError.createError({
      name: "Log in error",
      cause: loginError(),
      message: "email or password incorrect",
      code: Error.AUTH_ERROR,
    });
    res.render("login", { error: errorLogin, style: "login.css" });
  };

  //sign up with github
  static signupGithub = (req, res) => {
    const token = generateToken(req.user);
    const data = new User(req.user);
    res.cookie("cookieToken", token).render("profile", {
      style: "profile.css",
      successMessage: "log in with Github successfully",
      data,
    });
  };

  //log in up with github
  static loginGithub = (req, res) => {
    const token = generateToken(req.user);
    res.cookie("cookieToken", token).render("profile", {
      style: "profile.css",
    });
  };

  //forgot password
  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UsersService.getUserByEmail(email);
      if (!user) {
        res.render("forgotPassword", {
          error: `Unregistered user`,
          style: "forgotPassword.css",
        });
      }
      const emailToken = generateEmailToken(email, 3600);
      await sendChangePasswordEmail(req, email, emailToken);

      res.render("login", {
        message: `we send you a link to ${email}`,
        style: "login.css",
      });
    } catch (error) {
      logger.error(error);
    }
  };

  //reset password
  static resetPassword = async (req, res) => {
    try {
      const token = req.query.token;
      const { newPassword } = req.body;
      const validEmail = verifyEmailToken(token);
      //link expired
      if (!validEmail) {
        res.render("forgotPassword", {
          error: `The link expired, make a new one`,
          style: "forgotPassword.css",
        });
      }
      //user not found
      const user = await UsersService.getUserByEmail(validEmail);
      if (!user) {
        res.render("resetPassword", {
          error: "Invalid operation",
          style: "resetPassword.css",
        });
      }
      //repeated password
      if (isValidPassword(newPassword, user)) {
        res.render("resetPassword", {
          token,
          error: "Invalid password, try another",
          style: "resetPassword.css",
        });
      }
      //change password
      const userData = {
        ...user,
        password: createHash(newPassword),
      };
      await UsersService.updateUser(user._id, userData);
      res.render("login", {
        message: `Password updated successfully!`,
        style: "login.css",
      });
    } catch (error) {
      logger.error(error);
    }
  };

  //profile
  static profile = async (req, res) => {
    try {
      res.json({ status: "success", data: req.user });
    } catch (error) {
      logger.error(error);
    }
  };

  //fail auth
  static failAuth = (req, res) => {
    res.render("login", {
      style: "login.css",
      error: "invalid token, please authenticate again",
    });
  };

  //logout
  static logout = async (req, res) => {
    try {
      const user = { ...req.user };
      user.lastConnection = new Date();
      await UsersService.updateUser(user.id, user);
      res.clearCookie("cookieToken");
      res.redirect("/login", 200, { style: "login.css" });
    } catch (error) {
      res.render("profile", { error: "logout error", style: "profile.css" });
    }
  };
}
