const body = document.querySelector("body");
const sidebar = document.querySelector(".sidebar");
const sidebarOpen = document.querySelector("#sidebarOpen");
const close = document.querySelector(".sidebar.close");

sidebarOpen.addEventListener("click", () => {
    
      sidebar.classList.toggle("close");
    
  });




