"use strict";

// Importation du CSS
import '../src/css/style.css';

// Importation des modules
import './utils/lib.js';
import './pages/tournee.js';
import './pages/etape.js';
import './pages/details.js';
import './pages/precisions.js';
import './pages/entrepot.js';
import './pages/connexion.js';


// Fonction pour mettre à jour le composant en fonction de la route
function loadComponent(route, params) {
    const app = document.getElementById('app');
    if (app) {
        // Nettoyer le contenu précédent
        app.innerHTML = "";
        // Charger le composant en fonction de la route
        switch (route) {
            case "/":
                app.appendChild(document.createElement('tournee-page'));
                break;
            
            case "/connexion":
                app.appendChild(document.createElement('connexion-page'));
                break;

            case "/tournee":
                app.appendChild(document.createElement('tournee-page'));
                break;

            case "/etape":
                const etapePage = document.createElement('etape-page');
                if (params) {
                    const tournee = params.split('=')[1];
                    etapePage.setAttribute('data-param', tournee);
                }
                app.appendChild(etapePage); 
                break;
            
            case "/details":
                const detailsPage = document.createElement('details-page');
                detailsPage.classList.add('flex', 'flex-col', 'h-screen'); // Ajout de la classe min-h-screen
                if (params) {
                    const etape = params.split('=')[1];
                    detailsPage.setAttribute('data-param', etape);

                }
                app.appendChild(detailsPage); 
                break;

            case "/precisions":
                const precisionsPage = document.createElement('precisions-page');
                if (params) {
                    const etape = params.split('=')[1];
                    precisionsPage.setAttribute('data-param', etape);
                }
                app.appendChild(precisionsPage); 
                break;

            case "/entrepot":
                app.appendChild(document.createElement('entrepot-page'));
                break;

            default:
                app.appendChild(document.createElement('tournee-page'));
                break;
        }
    }
}
// Fonction pour gérer les routes avec hash
function router() {
    const hash = window.location.hash.slice(1);
    let pathNoParams = hash.split('?')[0];
    const params = hash.split('?')[1];
    if (pathNoParams === "")
        pathNoParams = "/"; // Rediriger vers la page d'accueil par défaut

    // Vérifier si l'utilisateur est connecté
    const cliweb = sessionStorage.getItem('cliweb');
    if (!cliweb && pathNoParams !== "/connexion") {
        window.location.hash = "#/connexion";
        return;
    }

    loadComponent(pathNoParams, params);
}
// Écouter les changements dans l'URL du hash
window.addEventListener("hashchange", router);
// Appeler la fonction router lors du chargement initial de la page
window.addEventListener("DOMContentLoaded", router);
