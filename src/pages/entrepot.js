import { ModelTournees } from '../models/modelTournees.js';
import { getUrlParameter } from '../utils/lib.js';

export class EntrepotPage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
    }
    connectedCallback() {
        this.render();
        this.getEmbRecap();
    }

    async getEmbRecap() {
        const data = {
            chauf_cod: sessionStorage.getItem("cliweb")
        };
        
        this.embRecap = await this.modelTournees.getEmbRecap(data);

        if (this.embRecap.tournees) {
            console.log("getEmbRecap");
            console.log(this.embRecap);

            this.querySelector('#recap').innerHTML = this.recapDisplay();
        }
    }

    recapDisplay() {
        let html = "";

        this.embRecap.tournees.forEach(tournee => {
            let htmlEmb = "";
            tournee.recap.forEach(emb => {
                htmlEmb += `<div class='gap-3 py-3'>
                                <h3 class='font-semibold'>${emb.embLib}</h3>
                                <div class='flex justify-between'>                                    
                                    <p>Déposés : ${emb.qteSortie}</p>
                                    <p>Récupérés : ${emb.qteEntree}</p>                                
                                </div>
                            </div>`;
            })

            html += `<div class="recapTournee bg-white rounded-md gap-3 p-3">
                        <h2 class='text-lg font-semibold'>Tournée ${tournee.nom}</h2>
                        ${htmlEmb}
                    </div>`;
        });

        return html;        
    }

    render() {
        this.innerHTML = `
        <div class='entete bg-white h-14 flex items-center flex-col justify-center relative'>
            <h1 class='font-bold'>RETOUR ENTREPÔT</h1>
            <div class='absolute left-3 flex items-center gap-3 text-xs'>
                <a href="#/">    
                    <i data-lucide="arrow-left"></i> 
                    RETOUR
                </a>        
            </div>
        </div>

        <div class='gap-3 p-3'>
            <div id="recap" class='flex flex-col gap-3'>
                                
            </div>
        </div>
        `;
        lucide.createIcons();
    }
}
customElements.define('entrepot-page', EntrepotPage);