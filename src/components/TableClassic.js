import { CustomElement } from '../utils/componentFactory.js';
export default class Table extends CustomElement {
    static get observedAttributes() {
        return ['data'];
    }
    render() {
        // On récupère les attributs du component
        const id = this.getAttribute('idname') || '';
        let css = this.getAttribute('css') || '';
        const title = this.getAttribute('title') || '';
        const data = JSON.parse(this.getAttribute('data') || '{"thead":[],"tbody":[]}');
        // On créé le parent du tableau
        const divBloc = document.createElement('div');
        divBloc.className = `rounded-lg overflow-y-scroll h-full ${(css.includes('sgTableBorder')) ? 'border border-dblueBase' : ''}`;
        if (css.includes('sgTableBorder')) {
            css = css.replace('sgTableBorder', '');
        }
        // On créé le tableau
        const table = document.createElement('table');
        table.id = id;
        table.className = `w-full ${css}`;
        // On créé l'en-tête du tableau avec le titre s'il y en a un
        const thead = document.createElement('thead');
        thead.className = 'text-white text-left rounded-t-lg sticky top-0 text-base bg-dblueBase';
        if (title) {
            const titleRow = document.createElement('tr');
            const titleCell = document.createElement('th');
            titleCell.textContent = title;
            titleCell.colSpan = data.thead.length;
            titleCell.className = 'text-lblueBase px-3.5 pt-1';
            titleRow.appendChild(titleCell);
            thead.appendChild(titleRow);
        }
        // On créé la ligne d'en-tête
        const headerRow = document.createElement('tr');
        // On créé les cellules de l'en-tête
        data.thead.forEach(header => {
            const th = document.createElement('th');
            th.innerHTML = header.lib;
            let thCss = header.css || '';
            thCss = thCss.includes('number') ? thCss.replace('number', 'text-right') : thCss;

            th.className = `px-3.5 pb-1 ${thCss}`;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        // On créé le corps du tableau
        const tbody = document.createElement('tbody');
        tbody.className = 'bg-white text-sm';
        // Les lignes
        data.tbody && data.tbody.forEach(row => {
            const trData = row.trData || {};
            const tr = document.createElement('tr');
            tr.className = `even:bg-dblueLight odd:bg-white hover:bg-dblueLightHover ${row.css ? row.css : ''}`;
            tr.dataset.id = row.id || "";
            tr.dataset.trData = trData;
            // Les cellules
            row.trData && row.trData.forEach(cell => {
                const td = document.createElement('td');
                td.innerHTML = cell.tdData;
                let tdCss = cell.css || '';
                tdCss = tdCss.includes('number') ? tdCss.replace('number', 'text-right') : tdCss;
                td.className = `px-3.5 py-1 ${tdCss}`;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        divBloc.appendChild(table);

        // On efface le contenu précédent et ajouter le nouveau tableau
        this.innerHTML = '';
        this.appendChild(divBloc);
    }
}
customElements.define('sg-table', Table);
