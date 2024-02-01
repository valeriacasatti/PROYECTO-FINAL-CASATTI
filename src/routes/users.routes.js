import { Router } from "express";
import { checkRole, isAuth } from "../middlewares/auth.js";
import { usersController } from "../controllers/users.controller.js";
import { documentsUpload } from "../utils.js";

const router = Router();

//get users
router.get("/", checkRole(["admin"]), usersController.getUsers);

//modify role
router.put("/premium/:uid", checkRole(["admin"]), usersController.modifyRole);

//delete offline users 2 days ago
router.delete(
  "/offline/:uid",
  checkRole(["admin"]),
  usersController.deleteUserOffline
);

//delete user
router.delete("/:uid", checkRole(["admin"]), usersController.deleteUser);

//upload documents
router.post(
  "/:uid/documents",
  isAuth,
  documentsUpload.fields([
    { name: "identification", maxCount: 1 },
    { name: "residence", maxCount: 1 },
    { name: "accountStatus", maxCount: 1 },
  ]),
  usersController.uploadDocuments
);

export { router as usersRouter };
