import { ModelTournees } from '../models/modelTournees.js';
import { getUrlParameter } from '../utils/lib.js';

export class DetailsPage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
        this.tourneeCod = getUrlParameter('tou_cod');
        this.facNbl = getUrlParameter('fac_nbl');
    }
    connectedCallback() {
        this.render();
        this.getTourneeDetails();
    }

    async getTourneeDetails() {
        //const tourneeCod = getUrlParameter('tou_cod');
        //const facNbl = getUrlParameter('fac_nbl');

        const data = {
            tou_cod: this.tourneeCod,
            fac_nbl: this.facNbl
        };

        this.detailsList = await this.modelTournees.getTouDetails(data);
        this.detailsList = this.detailsList.details;
        this.detailsList = this.detailsList.filter(val => val.facNbl == this.facNbl)[0];

        console.log("getTourneeDetails");
        console.log(this.detailsList);

        this.querySelector('#details').innerHTML = this.detailsDisplay();
    }
    

    detailsDisplay() {
        let html = `<div class='flex flex-col gap-3'>
                        <h1 class='text-center text-white font-semibold'>${this.detailsList.touCod + " - " + this.detailsList.touNom}</h1>
                        <div class='bg-white rounded-md flex flex-col gap-3 p-3'>
                            <p>${this.detailsList.cliTel}</p>
                            <p>${this.detailsList.cliNom}</p>
                            <p>${this.detailsList.cliAd1 + " " + this.detailsList.cliAd2}</p>
                            <p>${this.detailsList.cliCp} ${this.detailsList.cliVil}</p>
                        </div>
                        <div class='bg-white rounded-md flex flex-col gap-3 p-2'>
                            <p class='underline'>Commentaire :</p>
                            <p>${this.detailsList.facCochauf}</p>
                        </div>
                        <div class='bg-[#CCF4F4] flex items-center h-14 rounded-md p-3'>
                            <a href="#/precisions?tou_cod=${this.detailsList.touCod}&fac_nbl=${this.detailsList.facNbl}" class='w-full flex justify-between items-center gap-3'>
                                <p>VALIDER / PRÉCISER LA LIVRAISON</p>
                                <img src='img/icons/triangle.svg'>
                            </a>
                        </div>
                        <button class='bg-dblueBase text-white rounded-md h-14 flex justify-center items-center font-bold'>Afficher les images</button>
                    </div>`;
        return html;
    }

    render() {
        this.innerHTML = `
            <div class='entete bg-white h-14 flex items-center flex-col justify-center relative'>
                <h1>DÉTAILS</h1>
                <div class='absolute left-3 flex items-center gap-3 text-xs'>
                    <a href="#/etape?tou_cod=${this.tourneeCod}">
                        <i data-lucide="arrow-left"></i> 
                        RETOUR
                    </a>
                </div>
                    
            </div>

            <div class='p-3 flex flex-col gap-3 relative grow overflow-y-scroll' id="details">
                
                <div class='bg-lblueBase rounded-md h-14 w-14 flex items-center justify-center left-3 bottom-3 absolute'>
                    <i class='text-white' data-lucide="phone"></i>
                </div>
                
                <div class='bg-white rounded-md h-14 w-14 flex items-center justify-center right-3 bottom-3 absolute'>
                    <i class='text-dblueBase' data-lucide="map-pin"></i>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
}
customElements.define('details-page', DetailsPage);