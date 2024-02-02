import { ProductsService } from "../services/products.service.js";
import { Error } from "../enums/Error.js";
import { CustomError } from "../services/errors/customError.service.js";
import { updateProductError } from "../services/errors/createError.service.js";
import { logger } from "../helpers/logger.js";
import { UsersService } from "../services/users.service.js";
import { config } from "../config/config.js";
import { transporter } from "../config/gmail.js";

export class ProductsController {
  //get products
  static getProducts = async (req, res) => {
    try {
      const products = await ProductsService.getProducts();
      res.json({ status: "success", products: products });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };

  //add product
  static addProduct = async (req, res) => {
    try {
      const productInfo = req.body;
      productInfo.owner = req.user._id;
      const product = await ProductsService.addProduct(productInfo);
      if (product) {
        res.json({
          status: "success",
          message: `${productInfo.title} added successfully`,
          product: product,
        });
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //get product by id
  static getProductById = async (req, res) => {
    try {
      const pid = req.params.pid;
      const product = await ProductsService.getProductById(pid);
      if (product) {
        res.render("productDetail", {
          product: product,
          style: "productDetail.css",
        });
      } else {
        return res.json({
          status: "error",
          message: "error getting product...",
        });
      }
    } catch (error) {
      return res.json({ status: "error", message: error.message });
    }
  };

  //update product
  static updateProduct = async (req, res) => {
    try {
      const pid = req.params.pid;
      const updatedContent = req.body;

      const productProperties = [
        "title",
        "description",
        "price",
        "code",
        "stock",
        "category",
        "status",
        "thumbnail",
      ];

      const entries = Object.entries(updatedContent);

      for (const [clave] of entries) {
        if (!productProperties.includes(clave)) {
          const errorUpdateProduct = CustomError.createError({
            name: "error updating product",
            cause: updateProductError(pid, updatedContent),
            message: updateProductError(pid, updatedContent),
            code: Error.PRODUCTS_ERROR,
          });
          logger.error(errorUpdateProduct);
          throw new Error(errorUpdateProduct);
        }
      }
      const product = await ProductsService.updateProduct(pid, updatedContent);
      if (product) {
        res.json({
          status: "success",
          message: "product updated successfully",
          product: product,
        });
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      //product ID
      const pid = req.params.pid;
      const product = await ProductsService.getProductById(pid);
      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "product not found",
        });
      }
      //user ID
      const ownerId = product.owner;
      const ownerIdString = ownerId.toString();
      const user = await UsersService.getUserById(ownerIdString);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user not found",
        });
      }
      //if product belong to a premium user
      if (ownerIdString === user._id && user.role === "premium") {
        try {
          const template = (user) => `<h3>Dear ${user.firstName}😊</h3>
            <p>We would like to inform you that the following product, associated with your user ID, has been removed from our ecommerce:</p>
            <ul>
              <li>${product.title}</li>
              <li>${product.description}</li>
              <li>CODE: ${product.code}</li>
              <li>CATEGORY: ${product.category}</li>
            </ul>
            <p>If you have any questions or comments, please feel free to let us know. We are here to assist you.</p>
            <h4>Best regards, Valeria❤️</h4>`;
          await transporter.sendMail({
            from: config.gmail.account,
            to: user.email,
            subject: "Important notice regarding your product",
            html: template(user),
          });
        } catch (error) {
          res.json({ status: "error", message: error.message });
        }
      }
      //if premium user own the product || admin user
      if (
        (req.user.role === "premium" &&
          product.owner.toString() === req.user._id.toString()) ||
        req.user.role === "admin"
      ) {
        try {
          const result = await ProductsService.deleteProduct(pid);
          if (result) {
            res.json({
              status: "success",
              message: "product deleted successfully",
            });
          } else {
            res.json({
              status: "error",
              message: `${req.user.fullName} lacks delete permission for this product.`,
            });
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
}
