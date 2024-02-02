import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";

export class ViewsController {
  //home
  static home = async (req, res) => {
    try {
      res.render("home", { style: "home.css" });
    } catch (error) {
      res.json({ error: error.message });
    }
  };
  //shop
  static shop = async (req, res) => {
    try {
      const { limit = 2, page = 1, sort = { price: 1 } } = req.query;
      const query = {};
      const options = {
        limit,
        page,
        sort,
        lean: true,
      };
      const products = await ProductsService.getProductsPaginate(
        query,
        options
      );
      const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      const data = {
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `${baseUrl.replace(
              `page=${products.page}`,
              `page=${products.prevPage}`
            )}`
          : null,
        nextLink: products.hasNextPage
          ? baseUrl.includes("page")
            ? baseUrl.replace(
                `page=${products.page}`,
                `page=${products.nextPage}`
              )
            : baseUrl.concat(`?page=${products.nextPage}`)
          : null,
        style: "shop.css",
      };
      res.render("shop", data);
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //cart
  static cart = async (req, res) => {
    try {
      const cid = req.user.cart;
      const cart = await CartsService.getCartById(cid);
      if (!cart) {
        return res.json("cart not found");
      } else {
        res.render("cart", { cart, style: "cart.css" });
      }
    } catch (error) {
      res.render("cart", {
        style: "cart.css",
        error: "please sign up to access your cart",
      });
    }
  };

  //sign up
  static signup = (req, res) => {
    res.render("signup", { style: "signup.css" });
  };

  //login
  static login = (req, res) => {
    res.render("login", { style: "login.css" });
  };

  //forgot password
  static forgotPassword = (req, res) => {
    res.render("forgotPassword", { style: "forgotPassword.css" });
  };

  //reset password
  static resetPassword = (req, res) => {
    const token = req.query.token;
    res.render("resetPassword", { token, style: "resetPassword.css" });
  };

  //profile
  static profile = (req, res) => {
    let { message } = req.query;
    res.render("profile", { message, style: "profile.css" });
  };

  //admin
  static admin = (req, res) => {
    res.render("admin", { style: "admin.css" });
  };

  static addProducts = (req, res) => {
    res.render("addProducts", { style: "addProducts.css" });
  };
}
