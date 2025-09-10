//récupération des projets via l'API
async function fetchData(dataname) {
	const response = await fetch("http://localhost:5678/api"+"/"+dataname);
	const data = await response.json();
	return data;
}

// affichage dynamique des projets
async function displayProjects(idCategory) {
    const projects = await fetchData("works");
    const gallery = document.querySelector('.gallery');
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

async function displayCategories() {
    const categories = await fetchData("categories");
    const categoryDiv = document.querySelector('.categories');
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
    // ajout des autres boutons
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

function removeClickedButtons() {
    const buttons = document.querySelectorAll(".category-button");
    buttons.forEach(button => {
        button.classList.remove("clicked");
    });
}

await displayCategories();
//await displayProjects();