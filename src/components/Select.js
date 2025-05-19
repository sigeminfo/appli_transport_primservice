import { CustomElement } from '../utils/componentFactory.js';

export default class Select extends CustomElement {
    constructor() {
        super();
        this._options = [];
        console.log('Select constructor called');
    }

    get options() {
        return this._options;
    }

    set options(value) {
        console.log('Setting options:', value);
        if (Array.isArray(value)) {
            this._options = value;
            this.updateOptions();
        }
    }

    connectedCallback() {
        console.log('Select connected to DOM');
        this.render();
    }

    updateOptions() {
        console.log('Updating options with:', this._options);
        const select = this.querySelector('select');
        if (select) {
            // Sauvegarder la valeur sélectionnée
            const currentValue = select.value;
            
            // Vider et mettre à jour les options
            select.innerHTML = '';
            this._options.forEach(option => {
                const optionElt = document.createElement('option');
                optionElt.className = 'rounded';
                optionElt.value = option.value;
                optionElt.textContent = option.lib;
                select.appendChild(optionElt);
            });

            // Restaurer la valeur sélectionnée si elle existe toujours
            if (currentValue && this._options.some(opt => opt.value === currentValue)) {
                select.value = currentValue;
            }

            console.log('Options updated in select, new options count:', select.options.length);
        } else {
            console.error('Select element not found in updateOptions');
        }
    }

    render() {
        console.log('Rendering select component');
        // On récupère les attributs du composant
        const label = this.getAttribute('label') || '';
        const id = this.getAttribute('idname') || '';
        const attr = JSON.parse(this.getAttribute('attr') || '{}');
        const selectCss = this.getAttribute('selectCss') || '';
        const css = this.getAttribute('css') || '';

        // On crée le conteneur principal
        const container = document.createElement('div');
        container.className = `flex flex-col ${css}`;

        // On crée le label
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.textContent = label;
        labelElement.className = 'text-base font-medium';
        container.appendChild(labelElement);

        // On crée l'input principal
        const select = document.createElement('select');
        select.className = `rounded border h-9 px-2 appearance-none bg-no-repeat bg-['url(/img/icons/select.svg)'] bg-[98%_center] bg-[25px_25px] ${selectCss}`;
        select.id = id;

        if (attr && Object.keys(attr).length > 0) {
            Object.entries(attr).forEach(([key, value]) => {
                select.setAttribute(key, value);
            });
        }

        container.appendChild(select);

        // On vide le contenu actuel et on ajoute le nouveau contenu
        this.innerHTML = '';
        this.appendChild(container);
    }
}

// Vérifier si le composant est déjà défini
if (!customElements.get('sg-select')) {
    console.log('Registering sg-select component');
    customElements.define('sg-select', Select);
} else {
    console.log('sg-select component already registered');
}