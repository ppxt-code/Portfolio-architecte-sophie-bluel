function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").innerHTML = data;
        });
}
loadHeader();