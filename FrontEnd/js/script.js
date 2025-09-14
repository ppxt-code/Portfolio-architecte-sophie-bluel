import { initModal } from "./modal.js";

// insère header.html dans <header> de la page dynamiquement
// ie dans les pages index.html et login.html
export async function loadHeader() {
    const response = await fetch("header.html");
    const data = await response.text();
    document.querySelector("header").innerHTML = data;
}
// modifie le lien "login" en "logout" dans le header si l'utilisateur est connecté
// enleve le lien de modification des projets, efface le token et userId dans localStorage
export function updateHeaderConnected() {
    if (localStorage.getItem("userId")) {
        let alogin = document.getElementById("alogin");
        alogin.textContent = "logout";
        alogin.href = window.location.href;
        alogin.addEventListener("click", function() {
            // suppression du token et userId dans localStorage
            localStorage.removeItem("userId");
            localStorage.removeItem("token");
            //
            alogin.textContent = "login";
            alogin.href = "./login.html";
            // suppression du lien de modification des projets
            let portfolioHeader = document.querySelector("#portfolio-header");
            let aLink = document.querySelector("#modif-a");
            if (aLink && portfolioHeader) {
                portfolioHeader.removeChild(aLink);
            }
        });
    }
}
// affichage du bouton de modification si on est connecté
function updateProjectsHeaderConnected() {
    if (localStorage.getItem("userId")) {
        let portfolioHeader = document.querySelector("#portfolio-header");
        if (portfolioHeader == null) return;
        let aLink = document.createElement("a");
        let iIcon = document.createElement("i");
        iIcon.className = "fa-regular fa-pen-to-square";
        aLink.appendChild(iIcon);
        let span = document.createElement("span");
        span.textContent = " modifier";
        aLink.appendChild(span);
        aLink.href = "#";
        aLink.id = "modif-a";
        portfolioHeader.appendChild(aLink);
        aLink.addEventListener("click", async function(event) {
            event.preventDefault();
            await initModal();
        });
    }
}

// enleve bold sur les liens du header
export function removeBoldOnHeaderLinks(){
    const links = document.querySelectorAll("nav ul li a");
    if (links === null) return;
    for (const link of links) {
        if (link.classList.contains("bolded")) link.classList.remove("bolded");
    }
    localStorage.removeItem("selectedLink");
}
// met le lien du header a bold si on clique dessus, enleve bold sur les autre liens
function addEventOnHeaderLinks() {
    const links = document.querySelectorAll("nav ul li a");
    for (const link of links) {
        link.addEventListener("click", () => {
            removeBoldOnHeaderLinks();
            link.classList.add("bolded");
            localStorage.setItem("selectedLink", link.id);
        });
    }
}
// pour remettre a bold le lien du header sur lequel on a cliqué meme si on change de page
function addEventOnLoad() {
    const selected = localStorage.getItem("selectedLink");
    if (selected) {
        const link = document.querySelector(`#${selected}`);
        if (link) link.classList.add("bolded");
    }
}

await loadHeader();
updateHeaderConnected();
addEventOnHeaderLinks();
addEventOnLoad();
updateProjectsHeaderConnected();
