async function loadHeader() {
  const response = await fetch("header.html");
  const data = await response.text();
  document.querySelector("header").innerHTML = data;
}
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
});