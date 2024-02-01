import { cartsDao } from "../dao/index.js";

export class CartsService {
  //get carts
  static getCarts = () => {
    return cartsDao.getCarts();
  };
  //add cart
  static addCart = () => {
    return cartsDao.addCart();
  };
  //get cart by ID
  static getCartById = (id) => {
    return cartsDao.getCartById(id);
  };
  //update cart
  static updateCart = (id, data) => {
    return cartsDao.updateCart(id, data);
  };
  //delete cart
  static deleteCart = (id) => {
    return cartsDao.deleteCart(id);
  };
  //add product to cart
  static addProduct = (cid, pid) => {
    return cartsDao.addProduct(cid, pid);
  };
  //delete product from cart
  static deleteProductCart = (cid, pid) => {
    return cartsDao.deleteProductCart(cid, pid);
  };
  //update product from cart
  static updateProductCart = (cid, pid, newQuantity) => {
    return cartsDao.updateProductCart(cid, pid, newQuantity);
  };
}
