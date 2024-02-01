document.addEventListener("DOMContentLoaded", async () => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");

  const hasShownAlert = localStorage.getItem("hasShownAlert");

  const handleSuccess = (data) => {
    name.textContent = data.fullName;
    email.textContent = data.email;
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
    } else {
      handleError();
    }
  } catch (error) {
    console.log(error);
    handleError();
  }
});
