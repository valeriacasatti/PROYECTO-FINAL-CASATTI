import { UsersService } from "../services/users.service.js";
import { transporter } from "../config/gmail.js";
import { config } from "../config/config.js";
import { CartsService } from "../services/carts.service.js";

export class usersController {
  //get users
  static getUsers = async (req, res) => {
    try {
      const data = await UsersService.getUsers();
      res.render("users", { style: "users.css", data });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //modify role
  static modifyRole = async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await UsersService.getUserById(uid);
      if (!user) {
        return res.json({ status: "error", message: "user not found" });
      }
      if (user.status !== "complete") {
        return res.json({
          status: "error",
          message: "The user has not uploaded all the documents",
        });
      }
      if (user.role === "premium") {
        user.role = "user";
      } else if (user.role === "user") {
        user.role = "premium";
      } else {
        return res.json({
          status: "error",
          message: "Unable to modify user role",
        });
      }
      await UsersService.updateUser(user._id, user);
      res.json({
        status: "success",
        message: "user role modified successfully",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //upload documents
  static uploadDocuments = async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await UsersService.getUserById(uid);
      const identification = req.files["identification"]?.[0] || null;
      const residence = req.files["residence"]?.[0] || null;
      const accountStatus = req.files["accountStatus"]?.[0] || null;
      const docs = [];
      if (identification) {
        docs.push({
          name: "identification",
          reference: identification.filename,
        });
      }
      if (residence) {
        docs.push({
          name: "residence",
          reference: residence.filename,
        });
      }
      if (accountStatus) {
        docs.push({
          name: "accountStatus",
          reference: accountStatus.filename,
        });
      }
      user.documents = docs;
      if (docs.length < 3) {
        user.status = "incomplete";
      } else {
        user.status = "complete";
      }
      await UsersService.updateUser(uid, user);
      res.json({
        status: "success",
        message: "documents uploaded successfully",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //delete offline users 2 days ago
  static deleteUserOffline = async (req, res) => {
    const uid = req.params.uid;
    const user = await UsersService.getUserById(uid);
    if (!user) {
      return res.json({ status: "error", message: "user not found" });
    }
    const userLastConnection = user.lastConnection;
    const today = new Date();
    const result = today - userLastConnection;
    const diferenceDays = result / (1000 * 60 * 60 * 24);
    if (diferenceDays > 2) {
      await UsersService.deleteUser(uid);
      const template = (user) => `<h3>Dear ${user.firstName}😊</h3>
      <p>I hope this message finds you well. I'm reaching out from my practice ecommerce to inform you that, after 2 days of inactivity on the website, i have removed your account for security reasons. I would be delighted to welcome you back whenever you wish.</p>
      <h5>Thank you for visiting my website. If you have any questions or need assistance, feel free to reach out. I look forward to serving you again in the future.</h5>
      <h4>Best regards, Valeria❤️</h4>`;
      try {
        await transporter.sendMail({
          from: config.gmail.account,
          to: user.email,
          subject: "Important notice regarding your account",
          html: template(user),
        });
        return res.json({
          status: "success",
          message: "user removed successfully",
        });
      } catch (error) {
        console.error("Error sending email:", error);
        return res.json({ status: "error", message: "Error sending email" });
      }
    }
    return res.json({
      status: "error",
      message: "user cannot be removed at this time",
    });
  };

  //delete user
  static deleteUser = async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await UsersService.getUserById(uid);

      if (user.role === "premium" || user.role === "user") {
        const result = await UsersService.deleteUser(uid);

        if (result) {
          await CartsService.deleteCart(user.cart);
        }
        return res.json({
          status: "success",
          message: "User removed successfully",
        });
      } else {
        return res.json({
          status: "error",
          message: "Unable to remove this user",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.json({ status: "error", message: error.message });
    }
  };
}
