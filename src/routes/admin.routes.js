import { Router } from "express";
import { checkRole, isAuth } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();

router.get("/", isAuth, ViewsController.admin);

router.get("/addProducts", isAuth, ViewsController.addProducts);

export { router as adminRouter };
