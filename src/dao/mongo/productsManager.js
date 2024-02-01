import { productsModel } from "./models/products.model.js";
import { Error } from "../../enums/Error.js";
import { CustomError } from "../../services/errors/customError.service.js";
import {
  addProductError,
  updateProductError,
  deleteProductError,
} from "../../services/errors/createError.service.js";
import { logger } from "../../helpers/logger.js";

export class ProductsManager {
  constructor() {
    this.model = productsModel;
  }

  //get products
  async getProducts() {
    try {
      const result = await this.model.find().lean();
      return result;
    } catch (error) {
      logger.error(`get products error: ${error.message}`);
      throw new Error(`get products error: ${error.message}`);
    }
  }

  //get products paginate
  async getProductsPaginate(query, options) {
    try {
      const result = await this.model.paginate(query, options);
      return result;
    } catch (error) {
      logger.error(`get products error: ${error.message}`);
      throw new Error(`get products error: ${error.message}`);
    }
  }

  //add product
  async addProduct(productInfo) {
    try {
      const result = await this.model.create(productInfo);
      return result;
    } catch (error) {
      const errorAddProduct = CustomError.createError({
        name: "error adding product",
        cause: addProductError(),
        message: addProductError(),
        code: Error.PRODUCTS_ERROR,
      });
      logger.error(errorAddProduct);
      throw errorAddProduct;
    }
  }

  //get product by ID
  async getProductById(id) {
    try {
      const result = await this.model.findById(id).lean();
      return result;
    } catch (error) {
      logger.error(`get product by id error: ${error.message}`);
      throw new Error(`the product with ID ${id} wasn't found`);
    }
  }

  //update product
  async updateProduct(id, updatedContent) {
    try {
      const result = await this.model.findByIdAndUpdate(id, updatedContent, {
        new: true,
      });
      return result;
    } catch (error) {
      const errorUpdateProduct = CustomError.createError({
        name: "error updating product",
        cause: updateProductError(),
        message: updateProductError(),
        code: Error.PRODUCTS_ERROR,
      });
      logger.error(errorUpdateProduct);
      throw new Error(errorUpdateProduct);
    }
  }

  //update product stock
  async updateProductStock(id, data) {
    try {
      const result = await this.model.updateMany(
        { _id: id },
        { $set: data },
        { new: true }
      );
      if (!result) {
        throw new Error("product not found");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`update product stock error: ${error.message}`);
      throw new Error(`update product stock error: ${error.message}`);
    }
  }

  //delete product
  async deleteProduct(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new Error(deleteProductError());
      } else {
        return result;
      }
    } catch (error) {
      const errorDeleteProduct = CustomError.createError({
        name: "error deleting product",
        cause: deleteProductError(),
        message: deleteProductError(),
        code: Error.PRODUCTS_ERROR,
      });
      logger.error(errorDeleteProduct);
      throw new Error(errorDeleteProduct);
    }
  }
}
