import { CartsService } from "../services/carts.service.js";
import { ProductsService } from "../services/products.service.js";
import { v4 as uuidv4 } from "uuid";
import { TicketsService } from "../services/tickets.service.js";
import { transporter } from "../config/gmail.js";
import { config } from "../config/config.js";

export class CartsController {
  //get carts
  static getCarts = async (req, res) => {
    try {
      const carts = await CartsService.getCarts();
      res.json({ carts: carts });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //add cart
  static addCart = async (req, res) => {
    try {
      const cart = await CartsService.addCart();
      res.json({
        status: "success",
        message: "cart added successfully",
        cart: cart,
      });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //get cart id
  static getCartById = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await CartsService.getCartById(cid);
      res.json({ cart: `cart ID: ${cid}`, cart });
    } catch (error) {
      res.json({ error: error.message });
    }
  };

  //delete cart
  static deleteCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      await CartsService.deleteCart(cid);
      res.json({
        status: "success",
        message: "cart deleted successfully",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //add products to
  static addProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await CartsService.getCartById(cid);

      const product = await ProductsService.getProductById(pid);
      const result = await CartsService.addProduct(cid, pid);

      res.json({
        status: "success",
        message: `${product.title} added to cart successfully`,
        cart: result,
        product: product,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //eliminar product del cart
  static deleteProductCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await CartsService.getCartById(cid);
      const result = await CartsService.deleteProductCart(cid, pid);
      res.json({
        status: "success",
        message: "product deleted from cart successfully",
        cart: result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //actualizar quantity del product en el cart
  static updateProductCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { newQuantity } = req.body;
      await CartsService.getCartById(cid);
      const result = await CartsService.updateProductCart(
        cid,
        pid,
        newQuantity
      );
      res.json({
        data: result,
        status: "success",
        message: "product updated successfully",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

  //purchase
  static purchaseCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      const cart = await CartsService.getCartById(cid);

      //if there are products in cart
      if (cart.products.length) {
        const rejectedProducts = [];
        const ticketProducts = [];

        //check products stock
        for (const cartProduct of cart.products) {
          const productInfo = cartProduct.productId;

          //if there is stock available
          if (cartProduct.quantity <= productInfo.stock) {
            ticketProducts.push(cartProduct);

            const newStock = productInfo.stock - cartProduct.quantity;

            //if insufficient stock
            if (newStock < 0) {
              rejectedProducts.push({
                products: [
                  {
                    productId: cartProduct._id,
                    quantity: productInfo.stock,
                  },
                ],
              });
              continue;
            }

            //update cart stock
            await CartsService.updateCart(cid, { stock: newStock });

            //update product stock
            await ProductsService.updateProductStock(productInfo._id, {
              stock: newStock,
            });
          } else {
            rejectedProducts.push({
              products: [
                {
                  productId: cartProduct._id,
                  quantity: productInfo.stock,
                },
              ],
            });
            continue;
          }
        }

        const sendTicket = async () => {
          //calcular amount
          let total = 0;
          ticketProducts.forEach((product) => {
            const precioCantidad = product.productId.price * product.quantity;
            total += precioCantidad;
          });

          const date = new Date();
          const localDateTime = date.toLocaleDateString();

          //datos del ticket
          const newTicket = {
            code: uuidv4(),
            purchase_datetime: localDateTime,
            amount: total,
            purchaser: req.user.email,
          };

          //crear ticket en DB
          const ticket = await TicketsService.addTicket(newTicket);

          //devolver datos del ticket
          const ticketId = await TicketsService.getTicketById(ticket._id);

          //enviar ticket por gmail
          const template = (ticket) => `<h1>Thanks for your purchase🥰</h1>
          <h3>Purchase details:</h3>
          <p>Purchase code: ${ticket.code}</p>
          <p>Date: ${ticket.purchase_datetime}</p>
          <p>Purchase total: ${ticket.amount}</p>
          <h2>Hope to see u again💕</h2>`;

          await transporter.sendMail({
            from: config.gmail.account,
            to: ticket.purchaser,
            subject: "Purchase receipt",
            html: template(ticket),
          });
        };

        //if there are stock of some products and no stock of some others
        if (rejectedProducts.length && ticketProducts.length) {
          sendTicket();
          await CartsService.updateCart(cid, { products: [] });
          return res.json({
            status: "success",
            message: "Purchase complete successfully!",
            rejectedProductsMessage:
              "Some products were left out of your purchase due to lack of stock",
          });

          //if there is no stock of any product
        } else if (rejectedProducts.length && ticketProducts.length === 0) {
          await CartsService.updateCart(cid, { products: [] });
          return res.json({
            status: "error",
            message: "The products in your cart exceed the available stock",
          });

          //if there is stock of all products
        } else {
          sendTicket();
          await CartsService.updateCart(cid, { products: [] });
          return res.json({
            status: "success",
            message: "Purchase complete successfully!",
          });
        }
      } else {
        res.json({ status: "error", message: "this cart is empty" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
}
