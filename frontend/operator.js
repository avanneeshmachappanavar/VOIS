
const inputLogHTML = `
  <h2>Operator Log</h2>
  <p class="card-subtitle">Enter inspection and maintenance data.</p>

  <label>Bus ID</label>
  <input type="number" id="bus_id" />

  <div class="row">
    <div>
      <label>Odometer (km)</label>
      <input type="number" id="mileage" />
    </div>
    <div>
      <label>Coolant Temp (°C)</label>
      <input type="number" id="temperature" />
    </div>
  </div>

  <label>Oil Level</label>
  <select id="oil_level">
    <option value="">Select level</option>
    <option value="FULL">FULL</option>
    <option value="NORMAL">NORMAL</option>
    <option value="LOW">LOW</option>
    <option value="CRITICAL">CRITICAL</option>
  </select>

  <label>Operator Notes</label>
  <textarea id="remarks"></textarea>

  <button class="primary-btn" onclick="submitLog()">Submit Log</button>
  <p id="msg"></p>
`;

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 Enable this later when auth is stable
  
  if (!token || role !== "operator") {
    alert("Unauthorized. Please login again.");
    localStorage.clear();
    window.location.replace("index.html");
    return;
  }
  
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

async function goToHistory() {
  toggleSidebar();
  setActiveMenu("menu-history");

  const card = document.querySelector(".card");

  // Render history layout
  card.innerHTML = `
    <h2>My Log History</h2>
    <table class="history-table">
      <thead>
        <tr>
          <th>Bus</th>
          <th>Mileage</th>
          <th>Temp</th>
          <th>Oil</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="historyBody"></tbody>
    </table>
  `;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://127.0.0.1:8000/operator/history", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch history");
    }

    const data = await res.json();
    const body = document.getElementById("historyBody");

    // Empty state
    if (data.length === 0) {
      body.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; color:#9ca3af;">
            No logs found
          </td>
        </tr>
      `;
      return;
    }

    // Populate rows
    data.forEach(log => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${log.bus_id}</td>
        <td>${log.mileage}</td>
        <td>${log.temperature}°C</td>
        <td>${log.oil_level}</td>
        <td>${new Date(log.created_at).toLocaleString()}</td>
      `;
      body.appendChild(row);
    });

  } catch (err) {
    card.innerHTML = `
      <p style="color:#ef4444; text-align:center;">
        Failed to load history. Please try again.
      </p>
    `;
  }
}

function showInputLog() {
  toggleSidebar();
  setActiveMenu("menu-input");
  document.querySelector(".card").innerHTML = inputLogHTML;
}


function setActiveMenu(id) {
  document.querySelectorAll(".menu li").forEach(item => {
    item.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}
