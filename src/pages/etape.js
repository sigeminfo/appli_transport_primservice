import { ModelTournees } from '../models/modelTournees.js';
import { getUrlParameter } from '../utils/lib.js';
import '../components/Select.js';

export class EtapePage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
        this.currentTourId = null;
    }

    connectedCallback() {        
        this.render();
        this.getTourneeDetails();
        
        this.getCamions();
        
        const camTemp = document.querySelector('#btnCamTemp');
        camTemp.addEventListener('click', (e) => {
            console.log("click");
            this.showCamionModal(this.etapesList[0].touCod);
        });

        const confirmCamion = document.querySelector('#confirmCamion');
        confirmCamion.addEventListener('click', (e) => {
            this.handleConfirmCamion();
        });
    }    

    showCamionModal(tourId) {
        this.currentTourId = getUrlParameter('tou_cod');

        const numCamion = this.querySelector('#numCamion');
        const tempCamion = this.querySelector('#tempCamion');

        //numCamion.value = sessionStorage.getItem('camion');
        tempCamion.value = "";

        const modal = this.querySelector('#modal-camion');
        modal.style.display = 'block';
    }

    handleConfirmCamion() {
        console.log("handleConfirmCamion");
        const numCamion = this.querySelector('#numCamion').value;
        const tempCamion = this.querySelector('#tempCamion').value;
        
        if (numCamion && tempCamion) {
            const data = {
                IOcam: numCamion,
                IOchauf: sessionStorage.getItem('cliweb'),
                IOtemp: tempCamion,
                IOtou: this.currentTourId
            };

            this.modelTournees.updateCamion(data).then((response) => {
                console.log("modif camion");
                console.log(response);

                sessionStorage.setItem('camion', numCamion);

                const modal = this.querySelector('#modal-camion');
                modal.style.display = 'none';
            });            
        } else {
            // Show error or alert
            alert('Veuillez remplir tous les champs');
        }
    }

    async getCamions() {
        const camions = await this.modelTournees.getCamions();
        const selectedNumCamion = sessionStorage.getItem('camion', numCamion);

        this.camionsList = camions.map(camion => ({
            value: camion.camCod || '', 
            lib: camion.camNom || ''    
        }));
        console.log('Camions formatés pour le select:', this.camionsList);
        console.log('selectedNumCamion', selectedNumCamion);        

        // Attendre que le select soit dans le DOM
        const waitForSelect = () => {
            let select = this.querySelector('#numCamion');
            if (select) {
                console.log('Updating select options');
                // Vider le select sauf l'option par défaut
                while (select.options.length > 1) {
                    select.remove(1);
                }
                
                // Ajouter les nouvelles options
                this.camionsList.forEach(camion => {
                    const option = document.createElement('option');
                    option.value = camion.value;
                    option.textContent = camion.value + " - " + camion.lib;
                    if (selectedNumCamion && camion.value === selectedNumCamion) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
            } else {
                console.log('Select not found, retrying...');
                setTimeout(waitForSelect, 100);
            }
        };
        
        waitForSelect();
    }

    async getTourneeDetails() {
        const tourneeCod = getUrlParameter('tou_cod');

        const data = {
            tou_cod: tourneeCod
        };

        this.etapesList = await this.modelTournees.getTouDetails(data);
        console.log(this.etapesList);

        this.etapesStatuts = this.etapesList.statuts; 
        this.etapesList = this.etapesList.details;
        
        console.log("getTourneeDetails");
        console.log(this.etapesList);

        this.querySelector('#etapes').innerHTML = this.etapesDisplay();
    }

    etapesDisplay() {
        let html = '<div class="flex flex-col gap-3">';
        this.etapesList && this.etapesList.forEach(val => {

            let color = "";
            let pbLiv = false;
            let htmlStatut = '';
            let statutFiltre= this.etapesStatuts.filter(statuts => statuts.facNbl == val.facNbl);

            statutFiltre && statutFiltre.forEach(statuts => {
                if (statuts.facNblActif == '1') {
                    color = statuts.pblivColor;
                    pbLiv = true;
                };
            });
            
            if (pbLiv == true) {
                htmlStatut = `<span class='h-5 w-5 rounded-full mr-3' style='background-color: rgb(${color})'></span>`;    
            }

            html += `<div class='${val.isLiv == 1 ? 'bg-green-200' : (pbLiv == true ? 'bg-white/50' : 'bg-white')} rounded-md relative h-18 p-3 cursor-pointer flex items-center'>
                        ${htmlStatut}
                        <a href="#/details?tou_cod=${val.touCod}&fac_nbl=${val.facNbl}" class='w-full flex items-center justify-between gap-3'>
                            <div>
                                <h3>${val.cliNom}</h3>
                                <p class='text-sm font-light'>${val.cliCp} - ${val.cliVil}</p>
                                <p class='text-sm font-light'><span class='underline font-bold'>Commentaire :</span> ${val.facCochauf}</p>
                            </div>
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

            <button id="btnCamTemp" class="bg-white rounded-md absolute h-12 p-3 cursor-pointer bottom-5 right-5">
                <i data-lucide="thermometer-snowflake"></i>
            </button>

            <div id='modal-camion' class='bg-dblueBase/50 h-full w-full fixed top-0 left-0 hidden'>
                <div class='bg-white rounded-t-[32px] flex flex-col items-center absolute bottom-0 w-full px-3 pb-4'>
                    <img src='/img/tournee.svg'>
                    <div class='flex justify-between w-full mb-3 gap-2 p-1'>
                        <div class="flex flex-col w-[48%]">
                            <label for="numCamion">Camion</label> 
                            <select id="numCamion" class="rounded border h-12 px-2 appearance-none bg-no-repeat bg-['url(/img/icons/select.svg)'] bg-[98%_center] bg-[25px_25px]">
                                <option value="">Sélect. un camion</option>
                            </select>
                        </div>
                        <sg-input input='number' idname='tempCamion' label='Température du camion' class='w-[48%]' inputCss='!h-12'></sg-input>
                    </div>
                    <sg-btn idname='confirmCamion' css='bg-dblueBase text-white h-12 rounded w-full font-bold text-lg' class='w-full' >Confirmer</sg-btn>
                </div>
            </div>
        `;
        lucide.createIcons();
    }
}
customElements.define('etape-page', EtapePage);