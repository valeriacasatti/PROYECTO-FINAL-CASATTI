document.addEventListener("DOMContentLoaded", async () => {
  const deleteProduct = document.querySelectorAll(".deleteProduct");
  const purchaseButton = document.querySelector(".purchaseButton");
  const products = document.querySelectorAll(".div");
  let cid;
  let totalCart = 0;

  //if cart is empty
  if (products.length === 0) {
    const container = document.getElementById("container");
    container.innerHTML = `<div id="emptyCart">
        <h3>your cart is empty🫠</h3>
        <a href="/shop"><button>return to shop</button></a>
        </div>`;
  } else {
    //total amount of each product
    products.forEach((el) => {
      const priceElement = el.querySelector(".price");
      const quantityElement = el.querySelector(".quantity");
      const totalElement = el.querySelector(".total-product");

      //values
      const price = parseFloat(priceElement.textContent.replace("$", ""));
      const quantity = parseInt(quantityElement.textContent.split(":")[1]);
      //total
      const total = price * quantity;
      totalElement.textContent = `total: $${total}`;

      //total cart
      totalCart += total;
      const totalCartElement = document.getElementById("total");
      totalCartElement.textContent = `total: $${totalCart}`;
    });

    //obtener cookie del usuario
    const getCookie = (cookieName) => {
      const cookies = document.cookie.split("; ");

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === cookieName) {
          return decodeURIComponent(value);
        }
      }
      return null;
    };
    const cookieToken = getCookie("cookieToken");
    if (cookieToken) {
      const base64Url = cookieToken.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const decodedToken = JSON.parse(atob(base64));
      cid = decodedToken.cart[0];
    }

    //delete product
    deleteProduct.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const productId = e.target.dataset.productId;
        await deleteFromCart(cid, productId);
      });
    });

    //purchase
    purchaseButton.addEventListener("click", async (e) => {
      const cartId = e.target.dataset.cartId;
      await finalizePurchase(cartId);
    });
  }
});

const errorHtml = document.getElementById("error");
//delete product
const deleteFromCart = async (cid, pid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.status === "success") {
      Swal.fire({
        color: "#fff",
        background: "#ff1c6f",
        text: `${result.message}`,
        timer: 1500,
        toast: true,
        position: "top",
        showConfirmButton: false,
        didOpen: () => {
          setTimeout(() => {
            location.reload(true);
          }, 1000);
        },
      });
    }
  } catch (error) {
    console.log("error deleting product from cart: ", error);
    errorHtml.innerHTML = "error deleting product";
  }
};

//purchase
const finalizePurchase = async (cid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
    });

    const result = await response.json();

    if (result.status === "success" && result.rejectedProductsMessage) {
      Swal.fire({
        title: `${result.message}`,
        html: `<h3>${result.rejectedProductsMessage}</h3>
        <h6>We send you more information by email</h6>
        <h4>Thanks for your purchase❤️</h4>`,
        showConfirmButton: false,
        footer: `<a href="/shop">Go back to shop</a>`,
        position: "center",
      });
    } else if (result.status === "error") {
      Swal.fire({
        title: `${result.message}`,
        showConfirmButton: false,
        footer: `<a href="/shop">Go back to shop</a>`,
        position: "center",
      });
    } else {
      Swal.fire({
        title: `${result.message}`,
        html: `<h6>We send you more information by email</h6>
        <h4>Thanks for your purchase❤️</h4>`,
        showConfirmButton: false,
        footer: `<a href="/shop">Go back to shop</a>`,
        position: "center",
      });
    }
  } catch (error) {
    console.error(error);
    document.getElementById("purchaseError").textContent =
      "Unexpected error occurred";
  }
};
