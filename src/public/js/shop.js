document.addEventListener("DOMContentLoaded", async () => {
  const addToCartButton = document.querySelectorAll(".addToCart");
  const productDetail = document.querySelectorAll(".productDetail");
  let cid;

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
  //add to cart
  addToCartButton.forEach((button) => {
    //stock 0
    const stockElement = button.parentElement.querySelector(".stock");
    const stockText = stockElement.textContent.trim();
    const stockNumber = parseInt(stockText.split(":")[1].trim());
    if (stockNumber === 0) {
      button.disabled = true;
      button.innerText = "out of stock";
    }

    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.productId;
      await addToCart(cid, productId);
    });
  });

  //view product detail
  productDetail.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.productId;
      await viewProductDetail(productId);
    });
  });
});

const addToCart = async (cid, pid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
    });

    //access denied for admin
    const url = response.url;
    const urlObj = new URL(url);
    const message = urlObj.searchParams.get("message");
    if (message) {
      Swal.fire({
        color: "#fff",
        background: "#ff1c6f",
        text: `${message}`,
        timer: 2000,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
    }

    const result = await response.json();

    //compare product stock & quantity
    const product = result.cart.products.find(
      (product) => product.productId === pid
    );
    if (product) {
      const quantity = product.quantity;
      const stock = result.product.stock;

      if (quantity >= stock) {
        const addToCartButton = document.querySelector(
          `.addToCart[data-product-id="${pid}"]`
        );
        if (addToCartButton) {
          addToCartButton.disabled = true;
        }
      }
    }

    if (result.status === "success") {
      Swal.fire({
        background: "#c2ffdb",
        text: `${result.message}`,
        timer: 2000,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        color: "#fff",
        background: "#ff1c6f",
        text: `${result.message}`,
        timer: 2000,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const viewProductDetail = async (pid) => {
  try {
    const response = await fetch(`/api/products/${pid}`, { method: "GET" });
    if (response.status === 200) {
      window.location.href = `/api/products/${pid}`;
    }
  } catch (error) {
    console.log(error);
  }
};
