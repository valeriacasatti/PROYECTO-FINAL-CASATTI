document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = document.getElementById("userInfo");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const role = document.getElementById("role");

  const hasShownAlert = localStorage.getItem("hasShownAlert");

  const handleSuccess = (data) => {
    name.textContent = data.fullName;
    email.textContent = data.email;
    role.textContent = `Role: ${data.role}`;
  };

  const handleError = () => {
    window.location.href = "/login";
  };

  try {
    const response = await fetch("/api/sessions/profile", {
      headers: { "Content-type": "application/json" },
      method: "POST",
    });
    const result = await response.json();

    if (result && result.status === "success") {
      if (!hasShownAlert) {
        Swal.fire({
          background: "#c2ffdb",
          text: "login successfully!",
          timer: 1500,
          toast: true,
          position: "top",
          showConfirmButton: false,
        });
        localStorage.setItem("hasShownAlert", "true");
      }
      handleSuccess(result.data);

      //premium button
      if (result.data.role === "premium") {
        const addButton = document.createElement("button");
        addButton.textContent = "add products";
        addButton.addEventListener("click", () => {
          window.location.href = "/api/admin/addProducts";
        });

        const linkWrapper = document.createElement("a");
        linkWrapper.href = "/api/admin/addProducts";
        linkWrapper.appendChild(addButton);

        userInfo.appendChild(linkWrapper);
      }
    } else {
      handleError();
    }
  } catch (error) {
    console.log(error);
    handleError();
  }
});
