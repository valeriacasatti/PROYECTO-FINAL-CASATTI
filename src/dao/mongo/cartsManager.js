import { cartsModel } from "./models/carts.model.js";
import { logger } from "../../helpers/logger.js";

export class CartsManager {
  constructor() {
    this.model = cartsModel;
  }

  //add cart
  async addCart() {
    try {
      const cart = {};
      const result = await this.model.create(cart);
      return result;
    } catch (error) {
      logger.error(`add cart error: ${error.message}`);
      throw new Error(`add cart error: ${error.message}`);
    }
  }

  //get carts
  async getCarts() {
    try {
      const result = await this.model.find().lean();
      return result;
    } catch (error) {
      logger.error(`get carts error: ${error.message}`);
      throw new Error(`get carts error: ${error.message}`);
    }
  }

  //get cart by ID
  async getCartById(id) {
    try {
      const result = await this.model
        .findById(id)
        .populate("products.productId")
        .lean();
      if (!result) {
        throw new Error("cart does not exist");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`get cart by ID error: ${error.message}`);
      throw new Error(`get cart by ID error: ${error.message}`);
    }
  }

  //update cart
  async updateCart(id, data) {
    try {
      const result = await this.model.updateMany(
        { _id: id },
        { $set: data },
        { new: true }
      );
      if (result.nModified === 0) {
        throw new Error("cart not found");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`update cart error: ${error.message}`);
      throw new Error(`update cart error: ${error.message}`);
    }
  }

  //delete cart
  async deleteCart(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        throw new Error("cart not found");
      } else {
        return result;
      }
    } catch (error) {
      logger.error(`delete cart error: ${error.message}`);
      throw new Error(`delete cart error: ${error.message}`);
    }
  }

  //add product to cart
  async addProduct(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      if (cart) {
        const product = cart.products.find(
          (product) => product.productId._id == pid
        );
        //increase quantity
        if (product) {
          product.quantity += 1;
        } else {
          const newProductCart = {
            productId: pid,
            quantity: 1,
          };
          cart.products.push(newProductCart);
        }
      }
      const result = await this.model.findByIdAndUpdate(cid, cart, {
        new: true,
      });
      return result;
    } catch (error) {
      logger.error(`add product to cart error: ${error.message}`);
      throw new Error(`add product to cart error: ${error.message}`);
    }
  }

  //delete product from cart
  async deleteProductCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      const product = cart.products.find(
        (product) => product.productId._id == pid
      );
      if (product) {
        const newProducts = cart.products.filter((product) => {
          return product.productId._id != pid;
        });
        cart.products = newProducts;
        const result = await this.model.findByIdAndUpdate(cid, cart, {
          new: true,
        });
        return result;
      } else {
        throw new Error("error deleting product...");
      }
    } catch (error) {
      logger.error(`delete cart error: ${error.message}`);
      throw new Error(`delete cart error: ${error.message}`);
    }
  }

  //update product from cart
  async updateProductCart(cid, pid, newQuantity) {
    try {
      const cart = await this.getCartById(cid);
      const productIndex = cart.products.findIndex(
        (product) => product._id == pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        const result = await this.model.findByIdAndUpdate(cid, cart, {
          new: true,
        });
        return result;
      }
    } catch (error) {
      logger.error(`update product cart error: ${error.message}`);
      throw new Error(`update product cart error: ${error.message}`);
    }
  }
}
