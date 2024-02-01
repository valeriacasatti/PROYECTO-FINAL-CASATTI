document.addEventListener("DOMContentLoaded", async () => {
  const modifyButton = document.querySelectorAll(".modify");
  const deleteButton = document.querySelectorAll(".delete");
  //modify role
  modifyButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.dataset.userId;
      await modifyRole(userId);
    });
  });
  //delete user
  deleteButton.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.dataset.userId;
      await deleteUser(userId);
    });
  });
});
//modify role
const modifyRole = async (uid) => {
  try {
    const response = await fetch(`/api/users/premium/${uid}`, {
      method: "PUT",
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
        timer: 1500,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//delete user
const deleteUser = async (uid) => {
  try {
    const response = await fetch(`/api/users/${uid}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log(result);
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
    } else {
      Swal.fire({
        color: "#fff",
        background: "#ff1c6f",
        text: `${result.message}`,
        timer: 1500,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
