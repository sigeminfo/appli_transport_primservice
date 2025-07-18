import { ModelTournees } from '../models/modelTournees.js';
import { getUrlParameter } from '../utils/lib.js';

import '../components/ToggleBtn.js';
import '../components/Input.js';
import '../components/Btn.js';

export class PrecisionsPage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
        this.tourneeCod = getUrlParameter('tou_cod');
        this.facNbl = getUrlParameter('fac_nbl');
    }
    connectedCallback() {
        this.render();
        this.getTourneeDetails();
        this.getPal();

        const btnValidateDelivery = document.querySelector("#validateDelivery");
        btnValidateDelivery.addEventListener("click", (e) => {
            this.validateDelivery();
        });        
    }

    async getTourneeDetails() {
        //const tourneeCod = getUrlParameter('tou_cod');
        //const facNbl = getUrlParameter('fac_nbl');

        const data = {
            tou_cod: this.tourneeCod
        };

        this.statutList = await this.modelTournees.getTouDetails(data);

        if (this.statutList.details && this.statutList.statuts) {        
            this.detailsList = this.statutList.details.filter(val => val.facNbl == this.facNbl)[0];
            this.statutList = this.statutList.statuts.filter(val => val.facNbl == this.facNbl);

            console.log("getTourneeDetails");
            console.log(this.detailsList);

            this.querySelector('#statuts').innerHTML = this.statutDisplay();

            const switchStatuts = [...document.getElementsByClassName("statuts")];
            switchStatuts.forEach(val => {
                console.log("addEventListener Statuts");
                val.addEventListener("click", (e) => {
                    console.log("switch Statuts");
                    this.updateStatut(e);
                });
            });
        }
    }

    async getPal() {
        console.log("getPal");
        
        this.palList = await this.modelTournees.getPal();        
        console.log(this.palList);

        if (this.palList) {
            this.querySelector('#palettes').innerHTML = this.palDisplay();
        }
    }

    palDisplay() {
        let html = ''; // `<div class='flex justify-between gap-3'>`;

        this.palList.forEach(val => {
            html += `<h3>${val.palLib}</h3>
                    <div class='flex justify-between gap-3 palettes' data-pal-cod=${val.palCod}>
                        <div class='w-[48%]'>
                            <sg-input input='number' label='Palettes déposées' idname='${val.palCod}DepoInput' inputCss='!h-12'></sg-input>
                        </div>
                        <div class='w-[48%]'>
                            <sg-input input='number' label='Palettes récupérées' idname='${val.palCod}RecupInput' inputCss='!h-12'></sg-input>
                        </div>
                    </div>`;
        });

        //html += '</div>';

        return html;
    }

    statutList = [
        { id: 1, lib: "Client Absent", color: "#f67777" },
        { id: 2, lib: "Livraison effectuée", color: "#afe595" },
        { id: 3, lib: "Refus du client", color: "#7CCAE7"}
    ];

    statutDisplay() {
        let html = '<div class="bg-white rounded-md flex flex-col gap-3 p-3"><h3 class="font-semibold">Statut</h3>';
        
        this.statutList.forEach(val => {
            console.log(val.facNblActif);
            html += `<div class='flex items-center justify-between h-full'>
                        <div class='flex gap-3 items-center'><span class='h-5 w-5 rounded-full' style='background-color: rgb(${val.pblivColor})'></span><p>${val.pblivLib}</p></div>
                        <sg-toggle-btn css="statuts" idname='toggle-btn-${val.pblivCod}' value="${val.facNblActif == 1 ? 'checked' : ''}"></sg-toggle-btn>
                    </div>`;
        });
        html += '</div>';

        return html;
    }

    render() {
        this.innerHTML = `
            <div class='entete bg-white h-14 flex items-center flex-col justify-center relative'>
                <h1 class='font-bold'>PRÉCISIONS</h1>
                <div class='absolute left-3 flex items-center gap-3 text-xs'>
                    <a href="#/details?tou_cod=${this.tourneeCod}&fac_nbl=${this.facNbl}">
                        <i data-lucide="arrow-left"></i> 
                        RETOUR
                    </a>
                </div>
            </div>

            <div class='p-3 flex flex-col gap-3'>
                <div id="palettes" class='bg-white rounded-md flex flex-col gap-3 p-3'>
                </div>

                <div class='bg-white rounded-md flex justify-between gap-3 p-3'>
                    <div class='relative w-[65%]'>
                        <sg-input input='file' idname='btn-photos' css='bg-dblueBase rounded h-36 w-full' inputCss='bg-transparent border-0 h-full opacity-0 z-10'></sg-input>
                        <div class='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center gap-3'>
                            <i class='text-white h-10 w-10' data-lucide="camera"></i><p class='text-white'>Prendre une photo</p>
                        </div>
                    </div>
                    <div id='preview' class='h-36 w-[35%] rounded bg-slate-200 flex items-center justify-center'><i class='text-slate-500 w-20 h-20' data-lucide="image"></i></div>
                </div>

                <div id="statuts">                    
                </div>

                <sg-btn css='bg-lblueBase text-white rounded-md h-14 w-full font-semibold' idname="validateDelivery">VALIDER</sg-btn>
            </div>
        `;
        lucide.createIcons();
        document.getElementById('btn-photos').addEventListener('change', function (e) {
            const preview = document.getElementById('preview');
            const file = e.target.files[0];
            console.log(file.type);
            if (file && file.type.startsWith('image/')) {
                console.log(file);
                const reader = new FileReader();
                reader.onload = function (e) {
                    console.log(e.target.result);
                    let imgElt = document.createElement('img');
                    imgElt.src = e.target.result;
                    imgElt.style.width = '100%';
                    imgElt.style.height = '100%';
                    imgElt.style.objectFit = 'contain';
                    preview.innerHTML = '';
                    preview.appendChild(imgElt);
                };
                reader.readAsDataURL(file);
            } else {
                console.log('error');
            }
        });        
    }

    updateStatut(e) {
        console.log("updateStatut");
        console.log(e.target.checked);

        const data = {
            IOnbl: this.detailsList.facNbl,
            IOpblivCod: e.target.id.split("-")[2],
            IOpblivValue: e.target.checked
        };
        
        this.modelTournees.updateStatut(data).then((response) => {
            console.log("Statut OK");
            console.log(response);
        });
    }

    validateDelivery() {
        console.log("validateDelivery");
        let palettes = document.querySelectorAll('.palettes'); 
        let dataPal = [];

        const data = {
            IOtou: this.detailsList.touCod,
            IOnbl: this.detailsList.facNbl,
            IOchauf: sessionStorage.getItem('cliweb')
        };

        if (document.getElementById('btn-photos').files[0]) {
            this.modelTournees.compULImage(document.getElementById('btn-photos').files[0], this.detailsList.facNbl);
        }

        palettes.forEach(palette => {
            console.log(palette.dataset.palCod);
            
            const depoInput = palette.querySelector(`#${palette.dataset.palCod}DepoInput`);
            const recupInput = palette.querySelector(`#${palette.dataset.palCod}RecupInput`);
            
            dataPal.push({
                palCod: palette.dataset.palCod,
                entree: depoInput ? depoInput.value : '',
                sortie: recupInput ? recupInput.value : '',
                chauf: sessionStorage.getItem('cliweb'),
                facNbl: this.detailsList.facNbl,
            });
        });

        dataPal = {
            "palettes": [...dataPal]
        }

        console.log(data, dataPal);

        this.modelTournees.updateStockPal(dataPal).then((response) => {
            console.log("Palettes OK");
            console.log(response);
 
            // si la requête pour les palettes est OK, on envoie la validation de la livraison
            this.modelTournees.validateDelivery(data).then((responseValidate) => {
                console.log("Livraison OK");
                console.log(responseValidate);
                window.location.href = `#/etape?tou_cod=${this.detailsList.touCod}`;
            });            
        });        
    }
}
customElements.define('precisions-page', PrecisionsPage);