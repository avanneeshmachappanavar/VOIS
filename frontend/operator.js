document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 Enable this later when auth is stable
  /*
  if (!token || role !== "operator") {
    alert("Unauthorized. Please login again.");
    localStorage.clear();
    window.location.replace("index.html");
    return;
  }
  */
});


async function submitLog() {
  const token = localStorage.getItem("token");

  const payload = {
    bus_id: Number(document.getElementById("bus_id").value),
    mileage: Number(document.getElementById("mileage").value),
    temperature: Number(document.getElementById("temperature").value),
    oil_level: document.getElementById("oil_level").value,
    remarks: document.getElementById("remarks").value
  };

  const res = await fetch("http://127.0.0.1:8000/operator/input", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  const msg = document.getElementById("msg");

  if (res.ok) {
    msg.style.color = "#22c55e";
    msg.innerText = "Log submitted successfully";
  } else {
    msg.style.color = "#ef4444";
    msg.innerText = data.detail || "Submission failed";
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("backdrop");

  sidebar.classList.toggle("open");
  backdrop.classList.toggle("show");
}


function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}

function goToHistory() {
  alert("My History coming soon 🚧");
}

