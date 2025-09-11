import { displayProjectsForModule } from "./works.js";

function addEventOnModal() {
    const body = document.querySelector("body");
    const closeButton = document.querySelector("#div-close i");
    const dialog = document.querySelector("dialog");
    closeButton.addEventListener("click", () => {
        dialog.close();
        body.removeChild(dialog);
        body.classList.remove("backgroundgrey");
    });
    body.addEventListener("click", () => {
        dialog.close();
        body.removeChild(dialog);
        body.classList.remove("backgroundgrey");
    });
}
export async function  initModal() {
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
    addEventOnModal();
    // affichage de la boîte de dialogue modale
    dialog.showModal();
    // affichage du fond en grisé
    body.classList.add("backgroundgrey");
}