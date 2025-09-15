import {getURL} from "./works.js"
import {removeBoldOnHeaderLinks} from "./script.js"

// envoi du formulaire de login on POST /api/users/login
function submitLogin() {
    const form = document.querySelector("#login form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        // on enleve les liens du header en gras
        removeBoldOnHeaderLinks();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const url= await getURL();
        const response = await fetch(url+"/users/login", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"   
            },
            body: JSON.stringify({            
                email: email,
                password: password
            })
        });
        if (response.ok) {
            await responseOk(response);
        } else {
            if (response.status === 404 && response.statusText === "Not Found")
                alert("Erreur dans l'identifiant ou le mot de passe");
            else
                alert("Erreur "+response.status+" : "+response.statusText);
        }
    });
}

// traitement de la réponse si le login est ok
async function responseOk(response) {
    const data = await response.json();
    // sauvegarde du token et userId dans localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    // redirection vers index.html
    window.location.href = "./index.html";
}

// works.js est importé par modal.js	
// modal.js est importé par script.js	
// script.js est importé par login.js	

// initialisation de login.js
submitLogin();