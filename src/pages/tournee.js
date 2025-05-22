import { ModelTournees } from '../models/modelTournees.js';

export class TourneePage extends HTMLElement {
    constructor() {
        super();
        this.modelTournees = new ModelTournees();
    }

    connectedCallback() {
        this.render();
        this.getTournees();

        this.getCamions();

        this.addEventListener('click', (event) => {
            console.log("click");
            const tourneeElement = event.target.closest('.tournee');
            if (tourneeElement) {
                const tourId = tourneeElement.dataset.id;
                this.showCamionModal(tourId);
            }
            if (event.target.closest('#confirmCamion')) {
                this.handleConfirmCamion();
            }
        });
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

                // Both fields are filled, redirect to etape page
                window.location.href = `#/etape?tou_cod=${this.currentTourId}`;
            });            
        } else {
            // Show error or alert
            alert('Veuillez remplir tous les champs');
        }
    }

    async getCamions() {
        const camions = await this.modelTournees.getCamions();
        this.camionsList = camions.map(camion => ({
            value: camion.camCod || '', 
            lib: camion.camNom || ''    
        }));
        console.log('Camions formatés pour le select:', this.camionsList);
        
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
                    select.appendChild(option);
                });
            } else {
                console.log('Select not found, retrying...');
                setTimeout(waitForSelect, 100);
            }
        };
        
        waitForSelect();
    }
    

    async getTournees() {        
        this.tourneeList = await this.modelTournees.getAllTou();
    
        console.log("getTournees");
        console.log(this.tourneeList);
    
        this.querySelector('#tournees').innerHTML = this.tourneesDisplay();
    }

    tourneesDisplay() {        
        let html = '<div class="grid grid-cols-2 gap-3 pb-[56px]">';
        this.tourneeList.forEach(val => {
            html += `<div data-id='${val.id}' class='tournee bg-white rounded-md flex items-center justify-center relative h-20 p-3 cursor-pointer'>
                        <h3>${val.id} - ${val.nom}</h3> 
                        <!-- <p class='font-bold absolute left-1.5 bottom-1.5'>${val.order}</p> -->
                    </div>`;
        });
        html += '</div>';
        return html;
    } 

    showCamionModal(tourId) {
        // Store the tour ID for later use
        this.currentTourId = tourId;
        // Show the modal
        const modal = this.querySelector('#modal-camion');
        modal.style.display = 'block';
        
        console.log(`Showing modal for tour ID: ${tourId}`);
    }

    render() {
        this.innerHTML = `
            <div class='entete bg-white h-14 flex items-center flex-col justify-center relative'>
                <h1 class='font-bold'>Tournées</h1>
            </div>

            <div class='p-3 flex flex-col gap-3' id="tournees">

            </div>

            <div id='modal-camion' class='bg-dblueBase/50 h-full w-full fixed top-0 left-0 hidden'>
                <div class='bg-white rounded-t-[32px] flex flex-col items-center absolute bottom-0 w-full px-3 pb-4'>
                    <img src='/img/tournee.svg'>
                    <div class='flex justify-between w-full mb-3'>
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
customElements.define('tournee-page', TourneePage);