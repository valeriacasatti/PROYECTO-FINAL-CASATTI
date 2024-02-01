import { Error } from "../enums/Error.js";

export const errorHandler = (error, req, res, next) => {
  switch (error.code) {
    case Error.DATABASE_ERROR:
      res.json({
        status: "error",
        error: error.cause,
        message: error.message,
      });
      break;
    case Error.AUTH_ERROR:
      res.json({
        status: "error",
        error: error.cause,
        message: error.message,
      });
      break;
    case Error.JSON_BODY_ERROR:
      res.json({
        status: "error",
        error: error.cause,
        message: error.message,
      });
      break;
  }
};
