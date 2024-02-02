import express from "express";
import path from "path";
import { __dirname } from "./utils.js";
import { logger } from "./helpers/logger.js";
import { connectDB } from "./config/DBconnection.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { engine } from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { swaggerSpecs } from "./config/swagger.config.js";
import swaggerUI from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler.js";
import { adminRouter } from "./routes/admin.routes.js";

//server
const port = process.env.port || 8080;
const app = express();
const httpServer = app.listen(port, () =>
  logger.info(`server running on port ${port}`)
);

//middlewares
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//DB connection
connectDB();

//passport
initializePassport();
app.use(passport.initialize());

//handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

//routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

app.use(errorHandler);

export { app };
