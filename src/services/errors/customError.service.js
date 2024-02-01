export class CustomError {
  static createError({ name = "error", cause, message, code }) {
    const error = new Error(message);
    error.cause = cause;
    error.name = name;
    error.code = code;
    return error;
  }
}
