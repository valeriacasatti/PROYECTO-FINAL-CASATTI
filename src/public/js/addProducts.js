document.addEventListener("DOMContentLoaded", async () => {
  const addProductForm = document.getElementById("addProductForm");

  addProductForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      const formData = {
        title: e.target.title.value,
        description: e.target.description.value,
        price: e.target.price.value,
        code: e.target.code.value,
        stock: e.target.stock.value,
        status: e.target.status.value,
        category: e.target.category.value,
        thumbnail: e.target.thumbnail.value,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.status === "success") {
        Swal.fire({
          background: "#c2ffdb",
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
  });
});
