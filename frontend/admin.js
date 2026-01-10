console.log("ADMIN PAGE LOADED");
console.log("token =", localStorage.getItem("token"));
console.log("role =", localStorage.getItem("role"));
const API_URL = "http://127.0.0.1:8000/admin/dashboard" ;

let allMlResults = [];

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

   if (!token || role !== "maintenance") {
    alert("Unauthorized");
    localStorage.clear();
    window.location.replace("index.html");
    return;
  }

  loadDashboard();
});

function loadDashboard() {
  const token = localStorage.getItem("token");

  fetch(API_URL, {  
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("Dashboard data:", data);
      
      allMlResults = data.ml_results;
      renderTable(allMlResults);

      document.getElementById("totalLogs").innerText = data.total_logs;
      document.getElementById("highRisk").innerText = data.high_risk_vehicles;
      document.getElementById("systemStatus").innerText = data.system_status;
      
      document.getElementById("nextMaintenance").innerText =
  data.next_maintenance_km !== null && data.next_maintenance_km !== undefined
    ? `${data.next_maintenance_km} km`
    : "No action needed";

      const table = document.getElementById("mlTable");
      table.innerHTML = "";

      data.ml_results.forEach(r => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.bus_id}</td>
          <td>${r.probability}</td>
          <td style="color:${r.risk === "HIGH" ? "red" : "green"}">
            ${r.risk}
          </td>
        `;
        table.appendChild(row);
      });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to load dashboard");
    });
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}

function renderTable(results) {
  const table = document.getElementById("mlTable");
  table.innerHTML = "";

  if (results.length === 0) {
    table.innerHTML = `<tr><td colspan="3">No results found</td></tr>`;
    return;
  }

  results.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.bus_id}</td>
      <td>${r.probability}</td>
      <td style="color:${r.risk === "HIGH" ? "red" : "green"}">
        ${r.risk}
      </td>
    `;
    table.appendChild(row);
  });
}

function filterByBus() {
  const query = document.getElementById("busSearch").value.trim();

  if (query === "") {
    renderTable(allMlResults);
    return;
  }

  const filtered = allMlResults.filter(r =>
    r.bus_id.toString().includes(query)
  );

  renderTable(filtered);
}
