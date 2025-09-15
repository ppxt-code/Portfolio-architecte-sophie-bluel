export async function getURL() {
    const response = await fetch("url.json");
    const data = await response.json();
    const url = data.url;
    return url;
}

//récupération des projets via l'API
export async function fetchData(dataname) {
    const url= await getURL();
	const response = await fetch(url+"/"+dataname);
    if (!response.ok) {
        console.error(`Erreur HTTP ! statut: ${response.status} on get ${dataname}`);
        return null;
    }
	const data = await response.json();
	return data;
}
// delete du projet id via l'API, return true si succes
export async function deleteData(id) {
    const token = window.localStorage.getItem("token");
    if (token === null) {
        console.error("le token de connexion n'est plus dans le localStorage");
        return false;
    }
    let deleted = false;
    const url= await getURL();
    const response = await fetch(url+"/works/"+id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) {
        console.error(`Erreur HTTP ! statut: ${response.status} on delete project ${id}`);
    } else {
       deleted = true;
    }
    return deleted;
}
// post d'une image via l'API, return true si succes
export async function postData(title, imageUrl, categoryId) {
    const token = window.localStorage.getItem("token");
    if (token === null) {
        console.error("le token de connexion n'est plus dans le localStorage");
        return false;
    }
    const categoryIdInt = parseInt(categoryId, 10);
    // recuperer une File à partir de l'URL cree par URL.createObjectURL(file)
    const blob = await fetch(imageUrl).then(res => res.blob());
    const file = new File([blob], "filename.png", { type: blob.type });

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryIdInt);
  
    const url= await getURL();
    const response = await fetch(url+"/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });
    if (!response.ok) {
        console.error(`Erreur HTTP ! statut: ${response.status} on post ${title}`);
        return false;
    } else {
        return true;
    }
}

// affichage dynamique des projets par catégorie, ou de tous les projets si idCategory<=0
export async function displayProjects(idCategory) {
    const gallery = document.querySelector(".gallery");
    if (gallery === null) return; // on n'est pas dans index.html
    const projects = await fetchData("works");
    gallery.innerHTML = ""; // vider la galerie avant d'ajouter de nouveaux projets
    // filtrer les projets par catégorie si une catégorie est sélectionnée
    let filteredProjects = (idCategory> 0) ? projects.filter(p => p.categoryId == idCategory) : projects;
    for (const project of filteredProjects) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = project.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// affichage dynamique des projets pour la fenetre modale
export async function displayProjectsForModal() {
    const projects = await fetchData("works");
    let gallery = document.querySelector(".gallery-for-modal");
    if (gallery === null) {
        console.error("modale mal construite echec de recherche de .gallery-for-modal");
        return;
    }
    gallery.innerHTML = ""; // vider la galerie avant d'ajouter de nouveaux projets
    // on rajoute un icone trash bin sur chaque image de projet
    for (const project of projects) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const icone = document.createElement("i");
        icone.className = "fa-solid fa-trash-can";
        icone.dataset.id = project.id; 
        img.src = project.imageUrl;
        img.alt = project.title;
        figure.appendChild(img);
        figure.appendChild(icone);
        gallery.appendChild(figure);
    }
}

// affichage des boutons de filtre par categorie et du bouton "Tous"
async function displayCategories() {
    if (localStorage.getItem("userId"))  return;

    const categoryDiv = document.querySelector('.categories');
    if (categoryDiv === null) return; // on n'est pas dans la fenetre index.html
    const categories = await fetchData("categories");
    categoryDiv.innerHTML = ""; // vider la div avant d'ajouter de nouveaux boutons
    // ajout du bouton "Tous" avec data-id 0
    let button = document.createElement("button");
    button.textContent = "Tous";
    button.setAttribute("data-id", 0);
    button.classList.add("category-button");
    categoryDiv.appendChild(button);
    button.addEventListener("click", async function () {
        removeClickedButtons();
        this.classList.add("clicked");
        console.log("class" + this.classList);
        await displayProjects(0);
    });
    // ajout des autres boutons: un par catégorie
    for (const category of categories) {
        button = document.createElement("button");
        button.textContent = category.name;
        button.setAttribute("data-id", category.id);
        button.classList.add("category-button");
        categoryDiv.appendChild(button);
        button.addEventListener("click", async function() {
            removeClickedButtons();
            this.classList.add("clicked");
            console.log("class"+this.classList);
            await displayProjects(category.id);
        });
    }
}
// on enleve la classe clicked sur tous les boutons de classe category-button 
function removeClickedButtons() {
    const buttons = document.querySelectorAll(".category-button");
    buttons.forEach(button => {
        button.classList.remove("clicked");
    });
}

// works.js est importé par modal.js	
// modal.js est importé par script.js	
// script.js est importé par login.js

// initialisation de works.js
await displayCategories();
//if (localStorage.getItem("userId")) {
    await displayProjects(0);
//}