import '../components/Input.js';
import '../components/Btn.js';
import { ModelTournees } from '../models/modelTournees.js';

export class ConnexionPage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
    }
    connectedCallback() {
        this.render();

        const btnConnexion = document.getElementById("btn-connexion");
        btnConnexion.addEventListener("click", () => {
            this.connexion();
        });
    }

    connexion() {
        console.log("connexion");
        const idConnexion = document.getElementById("identifiant");
        const mdpConnexion = document.getElementById("motdepasse");
        
        const data = {
            "IOid": idConnexion.value ? idConnexion.value : "", 
            "IOmdp": mdpConnexion.value ? mdpConnexion.value : ""
        };

        this.modelTournees.connexion(data).then((response) => {
            console.log(response);
            if (response.response.lCnx == 'true') {
                console.log("Connexion OK");
                sessionStorage.setItem('camion', '');
                sessionStorage.setItem('cliweb', idConnexion.value);
                window.location.href = "#/home-page";
            }
        });
    }

    render() {
        this.innerHTML = `
            <div class='p-3'>
                <div class='bg-white px-3 py-7 flex flex-col gap-3 rounded-md'>
                    <div class='flex justify-center mb-3'>
                        <img class='h-20' src='/img/logos/logoclient.svg'>
                    </div>
                    <h1 class='font-bold'>Transport Emballages</h1>
                    <div>
                        <sg-input input='text' idname='identifiant' inputCss='w-full h-10' label='Identifiant'></sg-input>
                    </div>
                    <div class='mb-3'>
                        <sg-input input='password' idname='motdepasse' inputCss='w-full h-10' label='Mot de passe'></sg-input>
                    </div>
                    <sg-btn css='bg-dblueBase text-white rounded-md h-10 w-full font-semibold' idname="btn-connexion">Se connecter</sg-btn>
                </div>
            </div>
        `;
    }
}
customElements.define('connexion-page', ConnexionPage);