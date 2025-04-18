import { ModelTournees } from '../models/modelTournees.js';
import { getUrlParameter } from '../utils/lib.js';

export class EtapePage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
    }

    connectedCallback() {
        this.render();
        this.getTourneeDetails();
    }    

    async getTourneeDetails() {
        const tourneeCod = getUrlParameter('tou_cod');

        const data = {
            tou_cod: tourneeCod
        };

        this.etapesList = await this.modelTournees.getTouDetails(data);
        this.etapesList = this.etapesList.details;

        console.log("getTourneeDetails");
        console.log(this.etapesList);

        this.querySelector('#etapes').innerHTML = this.etapesDisplay();
    }

    etapesDisplay() {
        let html = '<div class="flex flex-col gap-3">';
        this.etapesList && this.etapesList.forEach(val => {
            html += `<div class='${val.isLiv == 1 ? 'bg-green-200' : 'bg-white'} rounded-md relative h-12 p-3 cursor-pointer'>
                        <a href="#/details?tou_cod=${val.touCod}&fac_nbl=${val.facNbl}" class='w-full flex items-center justify-between gap-3'>
                            <h3>${val.cliNom}</h3>
                            <img src='img/icons/triangle.svg'>
                        </a>
                    </div>`;
        });

        if (!this.etapesList) {
            html += `<div class='bg-white rounded-md flex items-center justify-center relative h-12 p-3 cursor-pointer'>
                        <h3>Aucune étape</h3>
                    </div>`;
        }

        html += '</div>';
        return html;
    }

    render() {
        const tournee = this.getAttribute('data-param');
        console.log(tournee);
        this.innerHTML = `
            <div class='entete bg-white h-14 flex items-center flex-col justify-center relative'>
                <h1 class='font-bold'>ÉTAPES</h1>
                <div class='absolute left-3 flex items-center gap-3 text-xs'>
                    <a href="#/tournee">
                        <i data-lucide="arrow-left"></i> 
                        RETOUR
                    </a>
                </div>
            </div>

            <div class='p-3 flex flex-col gap-3' id="etapes">
                
            </div>
        `;
        lucide.createIcons();
        //console.log(etape);
    }
}
customElements.define('etape-page', EtapePage);