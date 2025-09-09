async function fetchProjects() {
	const response = await fetch("http://localhost:5678/api"+"/works");
	const projects = await response.json();
//    const projectsJson = JSON.stringify(projects);
//    localStorage.setItem('projects', projetsJson);
	return projects;
}
async function displayProjects() {
    const projects = await fetchProjects();
    const gallery = document.querySelector('.gallery');
    for (const project of projects) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = project.title;
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    };

}
await displayProjects();