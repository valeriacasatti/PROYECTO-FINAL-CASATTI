document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formValues = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    try {
      const response = await fetch("/api/sessions/login", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-type": "application/json",
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        window.location.href = "/profile";
      } else {
        window.location.href = "/api/sessions/fail-login";
      }
    } catch (fetchError) {
      console.error(fetchError);
      window.location.href = "/api/sessions/fail-login";
    }
  });
});
