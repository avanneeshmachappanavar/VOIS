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

  const backendURL = "http://127.0.0.1:8000";

  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const operatorLoginBtn = document.getElementById("operatorLoginBtn");

  // SAFETY CHECK (IMPORTANT)
  console.log("adminLoginBtn:", adminLoginBtn);
  console.log("operatorLoginBtn:", operatorLoginBtn);

  if (operatorLoginBtn) {
    operatorLoginBtn.onclick = () => {
      const username = document.getElementById("operatorUsername").value;
      const password = document.getElementById("operatorPassword").value;
      login(username, password , "operator");
    };
  }

  if (adminLoginBtn) {
    adminLoginBtn.onclick = () => {
      const username = document.getElementById("adminUsername").value;
      const password = document.getElementById("adminPassword").value;
      login(username, password , "maintenance");
    };

    ["adminUsername", "adminPassword", "operatorUsername", "operatorPassword"]
  .forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        document.getElementById("adminError").style.display = "none";
        document.getElementById("operatorError").style.display = "none";
      });
    }
  });

  }

 function login(username, password, expectedRole) {
  // Clear old errors
  document.getElementById("adminError").style.display = "none";
  document.getElementById("operatorError").style.display = "none";

  fetch(`${backendURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.access_token) {
      showError(expectedRole, "Invalid credentials");
      return;
    }

    // 🚫 ROLE MISMATCH (UX RULE)
    if (data.role !== expectedRole) {
      showError(
        expectedRole,
        `This account is not allowed to log in as ${expectedRole}`
      );
      return;
    }

  
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);

    alert(`Login successful as ${data.role}`);
    if (data.role === "operator") {
    window.location.href = "operator.html";
  }
  })
  .catch(() => {
    showError(expectedRole, "Server error. Try again.");
  });
}
//helper function..
function showError(role, message) {
  const errorEl =
    role === "maintenance"
      ? document.getElementById("adminError")
      : document.getElementById("operatorError");

  errorEl.innerText = "⛔ " + message;
  errorEl.style.display = "block";
}

});
