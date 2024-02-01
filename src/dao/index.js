import { ProductsManager } from "./mongo/productsManager.js";
import { CartsManager } from "./mongo/cartsManager.js";
import { UsersManager } from "./mongo/usersManager.js";
import { TikcketsManager } from "./mongo/ticketsManager.js";

export const productsDao = new ProductsManager();
export const cartsDao = new CartsManager();
export const usersDao = new UsersManager();
export const ticketsDao = new TikcketsManager();
