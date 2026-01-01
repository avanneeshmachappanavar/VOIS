const backendURL = "http://127.0.0.1:8000"; 

document.addEventListener("DOMContentLoaded", () => {

  const adminBtn = document.getElementById("adminBtn");
  const operatorBtn = document.getElementById("operatorBtn");
  const adminCard = document.getElementById("adminCard");
  const operatorCard = document.getElementById("operatorCard");

  adminBtn.onclick = () => {
    adminBtn.classList.add("active");
    operatorBtn.classList.remove("active");
    adminCard.classList.remove("hidden");
    operatorCard.classList.add("hidden");
  };

  operatorBtn.onclick = () => {
    operatorBtn.classList.add("active");
    adminBtn.classList.remove("active");
    operatorCard.classList.remove("hidden");
    adminCard.classList.add("hidden");
  };

  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const operatorLoginBtn = document.getElementById("operatorLoginBtn");

  if (operatorLoginBtn) {
    operatorLoginBtn.onclick = () => {
      login(
        document.getElementById("operatorUsername").value,
        document.getElementById("operatorPassword").value,
        "operator"
      );
    };
  }

  if (adminLoginBtn) {
    adminLoginBtn.onclick = () => {
      login(
        document.getElementById("adminUsername").value,
        document.getElementById("adminPassword").value,
        "maintenance"
      );
    };
  }

});

/* ---------------- LOGIN FUNCTION ---------------- */
function login(username, password, expectedRole) {
  document.getElementById("adminError").style.display = "none";
  document.getElementById("operatorError").style.display = "none";

  fetch(`${backendURL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {

    if (!data.access_token) {
      showError(expectedRole, "Invalid credentials");
      return;
    }

    localStorage.setItem("token", data.access_token);

    const role = data.role.trim();
    localStorage.setItem("role", role);

   if (role === "maintenance") {
  window.location.replace("http://127.0.0.1:5500/admin.html");
  return;
}
   if (role === "operator") {
  window.location.replace("http://127.0.0.1:5500/operator.html");
  return;
}


  })
  .catch(() => {
    showError(expectedRole, "Server error. Try again.");
  });
}

/* ---------------- ERROR HELPER ---------------- */

function showError(role, message) {
  const errorEl =
    role === "maintenance"
      ? document.getElementById("adminError")
      : document.getElementById("operatorError");

  errorEl.innerText = "⛔ " + message;
  errorEl.style.display = "block";
}

