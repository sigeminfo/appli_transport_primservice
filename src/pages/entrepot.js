import { ModelTournees } from '../models/modelTournees.js';
import { getUrlParameter } from '../utils/lib.js';

export class EntrepotPage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
    }
    connectedCallback() {
        this.render();
        this.getPalRecap();
    }

    async getPalRecap() {
        const data = {
            chauf_cod: sessionStorage.getItem("cliweb")
        };
        
        this.palRecap = await this.modelTournees.getPalRecap(data);

        if (this.palRecap.recap) {
            console.log("getPalRecap");
            console.log(this.palRecap);

            this.querySelector('#recap').innerHTML = this.recapDisplay();
        }
    }

    recapDisplay() {
        let html = "";

        this.palRecap.recap.forEach(pal => {
            html = `<div class="recapTournee bg-white rounded-md gap-3 p-3">
                            <h2 class='text-lg font-semibold'>${pal.cli_nom} - ${pal.pal_cod}</h2>
                            <div class='flex justify-between'>                                    
                                <p>Déposés : ${pal.sortie}</p>
                                <p>Récupérés : ${pal.entree}</p>                                
                            </div>
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