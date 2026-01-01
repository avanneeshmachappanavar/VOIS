console.log("ADMIN PAGE LOADED");
console.log("token =", localStorage.getItem("token"));
console.log("role =", localStorage.getItem("role"));


document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

   if (!token || role !== "maintenance") {
    alert("Unauthorized");
    localStorage.clear();
    window.location.replace("index.html");
  }
});

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

function logout() {
  localStorage.clear();
  window.location.replace("index.html");
}
