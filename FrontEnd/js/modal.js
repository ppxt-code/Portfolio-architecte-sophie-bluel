import { displayProjects, displayProjectsForModal, fetchData, postData, deleteData} from "./works.js";

// evenements sur le close de la modale :
function addEventOnCloseModal() {
    const closeButton = document.querySelector("i.fa-xmark");
    closeButton.addEventListener("click", handleCloseClick);
    // Clic sur document (hors modale)
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
        document.removeEventListener("click", outsideClickListener);
    }
}
function handleCloseClick() {
    const dialog = document.querySelector("#modal");
    dialog.close();
    dialog.innerHTML="";
//    document.body.removeChild(dialog);
    document.body.classList.remove("backgroundgrey");
    document.removeEventListener("click", outsideClickListener);
}

// evenement dans la fenetre modale "Ajout Photo" sur la flèche gauche
function addEventOnLeftArrow() {
    const leftArrow = document.querySelector(".fa-arrow-left");
    leftArrow.addEventListener("click", async () => {
        await initModal();
    });
}
// evenements sur les corbeilles sur images dans la gallerie de la fenetre modale "Galerie Photo"
function addEventonDelete() {
    const bins = document.querySelectorAll(".gallery-for-modal figure i.fa-trash-can");
    for (const bin of bins) {
        const id = bin.dataset.id;
        bin.addEventListener("click", async () => {
            const deleted = await deleteData(id);
            if (deleted) {
                // mettre à jour les projets dans la modale
                await initModal();
                // mettre à jour les projets dans la page principale 
                await displayProjects(0);
            }
        });
    }
}
// evenement sur le bouton [Ajouter une photo] dans la fenetre modale "Galerie Photo"
function addEventOnAddButton() {
    // button du form est de type="button"
    const addImgButton = document.querySelector("#addImgButton");
    addImgButton.addEventListener("click", async () => {
        await initModalPhoto();
    });
}
// evenement sur l'ajout d'une photo dans la fenetre modale "Ajout Photo"
function addEventOnAddPhoto() {
    document.getElementById("add-photo").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file && file.size > 4 * 1024 * 1024) { // 4 Mo en octets
            alert("Le fichier ne doit pas dépasser 4 Mo.");
            e.target.value = "";
        }
        if (file) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(file); // Crée URL temporaire affichable
            img.alt = "Aperçu de l'image sélectionnée";
            img.id =  "downloadee";
            const div = document.getElementById("div-add-photo");
            div.innerHTML = ""; 
            div.appendChild(img);
            // libérer l’URL après chargement pour économiser la mémoire
            //img.onload = () => URL.revokeObjectURL(img.src);
            //
            checkPhotoInfoFilled();
        }
  });
}
// evenement sur Titre et Catégorie de la fenetre modale "Ajout Photo"
function addEventOnAddPhotoInfo() {
    const title = document.getElementById("titre");
    title.addEventListener("change", () => {checkPhotoInfoFilled();});
    const category = document.getElementById("categorie");
    category.addEventListener("change", () => {checkPhotoInfoFilled();});
}
// verifie que le formulaire est complet et reactive le bouton addImgButton si c'est le cas
function checkPhotoInfoFilled() {
    const img = document.getElementById("downloadee");
    const hasimg = (img!==null) && (img.src!==null);
    const title = document.getElementById("titre");
    const hasTitle = (title!==null) && (title.value!==null) && (title.value.trim()!=="");
    const category = document.getElementById("categorie");
    const hascategory = (category!==null) && (category.value > 0);
    if (hasimg && hasTitle && hascategory) {
        const button = document.getElementById("addImgButton");
        button.classList.remove("background-gray");
        button.disabled = false;
    }
}
// evenement sur le bouton [Valider] de la fenetre modale "Ajout photo"
function addEventOnValidate() {
    // button est de type="button"
    const button = document.getElementById("addImgButton");
    button.addEventListener("click", async () => {
        const img = document.getElementById("downloadee");
        const title = document.getElementById("titre");
        const category = document.getElementById("categorie");
        const posted = await postData(title.value, img.src, category.value);
        if (posted) {
            // mettre à jour les projets dans la modale
            await initModalPhoto();
            // mettre à jour les projets dans la page principale 
            await displayProjects(0);
        }
    });
}

// creation de la fenetre modale "Galerie photo"
export async function initModal() {
    // création de la boîte de dialogue modale :
    let dialog = document.querySelector("#modal");
    if (dialog !== null) {
        dialog.innerHTML = ""; // on vide
    } else {
        dialog = document.createElement("dialog");
        dialog.id = "modal";
        document.body.appendChild(dialog);
    }
    // insertion de modaleGallery.html
    await loadHtmlInmodale("modaleGallery.html"); 
    // affichage des projets dans gallery-for-modal
    await displayProjectsForModal();
    // ajout des evenements 
    addEventOnCloseModal();
    addEventonDelete();
    addEventOnAddButton();
    // TODO les evenements de delete

    // affichage de la boîte de dialogue modale
    if (!dialog.open) dialog.showModal();
    // affichage du fond en grisé
    document.body.classList.add("backgroundgrey");
}

// insère htmlfile dans <dialog> de la page dynamiquement
async function loadHtmlInmodale(htmlfile)
{
    const response = await fetch(htmlfile);
    const data = await response.text();
    const dialog = document.querySelector("#modal");
    dialog.innerHTML = data;
}
async function fillCategories() {
    const select = document.getElementById("categorie");
    const categories = await fetchData("categories");
    // option vide
    let option = document.createElement("option");
    option.value = -1;
    option.textContent = "";
    select.appendChild(option);
    //
    for (const category of categories) {
        option = document.createElement("option");
        option.value = category.id;
        // echec de padding-left et de text-indent dans le css
        option.textContent = "\u00A0\u00A0\u00A0\u00A0"+category.name;
        select.appendChild(option);
    }
}
// creation de la fenetre modale "Ajout photo"
async function initModalPhoto() {
    let dialog = document.querySelector("#modal");
    if (dialog === null) {
        console.error("modale mal construite, echec a la recherche de #modal");
        return;
    }
    dialog.innerHTML = ""; // on vide

    // insertion de modaleAddPhoto.html
    await loadHtmlInmodale("modaleAddPhoto.html");
    // ajout des catégories
    await fillCategories();

    // ajout des evenements
    addEventOnLeftArrow();
    addEventOnCloseModal();
    addEventOnAddPhoto();
    addEventOnAddPhotoInfo();
    addEventOnValidate();
    if (!dialog.open) dialog.showModal();
}