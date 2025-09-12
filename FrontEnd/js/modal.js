import { displayProjectsForModule } from "./works.js";

// evenements sur le close de la modale :
function addEventOnCloseModal() {
    const body = document.querySelector("body");
    const closeButton = document.querySelector("i.fa-xmark");
    closeButton.addEventListener("click", handleCloseClick);
    // Clic sur body (hors modale)
    document.addEventListener("click", outsideClickListener);
}
function outsideClickListener(event) {
    const dialog = document.querySelector("#modal");
    // echec de dialog.contains(event.target)), on calcule à la main
    const rect = dialog.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    const isOutside = ( x < rect.left || x > rect.right 
        || y < rect.top || y > rect.bottom);
    if (dialog && isOutside) {//!dialog.contains(event.target)) {
        handleCloseClick();
        const body = document.querySelector("body");
        document.removeEventListener("click", outsideClickListener);
    }
}
function handleCloseClick() {
    const body = document.querySelector("body");
    const dialog = document.querySelector("#modal");
    dialog.close();
    body.removeChild(dialog);
    body.classList.remove("backgroundgrey");
    document.removeEventListener("click", outsideClickListener);
}
//
function addEventOnAddButton() {
    const addImgButton = document.querySelector("#div-add-image button");
    addImgButton.addEventListener("click", async () => {
        await initModalPhoto();
    });
}
function addEventOnAddPhoto() {
  document.getElementById("div-add-image").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (file && file.size > 4 * 1024 * 1024) { // 4 Mo en octets
      alert("Le fichier ne doit pas dépasser 4 Mo.");
      e.target.value = "";
    }
  });

}
//
export async function initModal() {
    // création de la boîte de dialogue modale :
    const body = document.querySelector("body");
    const dialog = document.createElement("dialog");
    dialog.id = "modal";
    const form = document.createElement("form");
    form.method = "dialog";
    // bouton de fermeture
    const closeDiv = document.createElement("div");
    closeDiv.id="div-close";
    const closeButton = document.createElement("i");
    closeButton.className="fa-solid fa-xmark";
    closeDiv.appendChild(closeButton)
    form.appendChild(closeDiv);
    // titre
    const title = document.createElement("nav");
    title.innerText = "Galerie photo";
    form.appendChild(title);
    // div pour la galerie dans la modale
    const divGallery = document.createElement("div");
    divGallery.classList.add("gallery-for-modal");
    form.appendChild(divGallery);
    dialog.appendChild(form);
    body.appendChild(dialog);
    // affichage des projets dans gallery
    await displayProjectsForModule();
    // ligne de séparation
    const line = document.createElement("hr");
    form.appendChild(line);
    // button pour ajouter une image
    const divaddImg = document.createElement("div");
    divaddImg.id = "div-add-image";
    const addImgButton = document.createElement("button");
    addImgButton.id = "addImgButton";
    addImgButton.innerText = "Ajouter une photo";
    divaddImg.appendChild(addImgButton);
    form.appendChild(divaddImg);
    // ajout des evenements 
    addEventOnCloseModal();
    addEventOnAddButton();
    // TODO les evenements de delete

    // affichage de la boîte de dialogue modale
    dialog.showModal();
    // affichage du fond en grisé
    body.classList.add("backgroundgrey");
}

// insère modaleAddPhoto.html dans <dialog> de la page dynamiquement
async function loadmodaleAddPhoto() {
    const response = await fetch("modaleAddPhoto.html");
    const data = await response.text();
    document.querySelector("dialog").innerHTML = data;
}
async function initModalPhoto() {
    const body = document.querySelector("body");
    // on vide l'ancienne modale :
    let dialog = document.querySelector("dialog");
    dialog.innerHTML = "";
 //   body.removeChild(dialog);

    // insertion de modaleAddPhoto.html
 //   dialog = document.createElement("dialog");
 //   dialog.id = "modal";
    await loadmodaleAddPhoto();
    body.appendChild(dialog);

    // ajout des evenements
    addEventOnCloseModal();
    addEventOnAddPhoto();
    // affichage de la boîte de dialogue modale
 //   dialog.showModal();

}