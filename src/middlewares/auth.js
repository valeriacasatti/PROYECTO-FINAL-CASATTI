import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { logger } from "../helpers/logger.js";

//check user autehenticated
export const isAuth = (req, res, next) => {
  const token = req.cookies.cookieToken;
  if (!token) {
    return res.json({
      status: "error",
      message: "missing cookieToken in the request cookies",
    });
  }

  jwt.verify(token, config.token.privateKey, (err, user) => {
    if (err) {
      logger.error(err);
      res.json({
        status: "error",
        message: "you must be authenticated to access",
      });
    }
    req.user = user;
    next();
  });
};

//check role user
export const checkRole = (roles) => {
  return (req, res, next) => {
    jwt.verify(
      req.cookies.cookieToken,
      config.token.privateKey,
      (err, user) => {
        if (err) {
          logger.error(err);
          res.redirect("/profile?error=access_denied");
        } else {
          if (roles.includes(user.role)) {
            next();
          } else {
            const errorMessage = `Access denied for ${user.role}`;
            logger.error(errorMessage);
            res.redirect(
              `/profile?error=access_denied&message=${errorMessage}`
            );
          }
        }
      }
    );
  };
};
