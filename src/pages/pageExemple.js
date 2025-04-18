import '../components/TableClassic.js';

import { Products } from '../models/products.js';

export class ExemplePage extends HTMLElement {
  constructor() {
    super();
    // Instanciation du modle de produits
    this.productsModel = new Products();
    // Initialisation du tableau de produits
    this.products = [];
    // Configuration des événements
    this.eventMap = [
      { selector: '#productSearch', events: [
        { type: 'input', handler: (e) => this.setDynamicSearch(e.target) },
        { type: 'click', handler: (e) => this.displayDynamicSearch(e.target) },
        { type: 'change', handler: (e) => this.filterTable(e.target) }
      ]}
    ];

  }

  connectedCallback() {
    // Rendu de la page
    this.render();  
    // Configuration des écouteurs d'événements
    this.setupEventListeners();
    // Récupération des produits
    this.getProducts();
  }

  // Récupération asynchrone de tous les produits
  async getProducts() {
    this.products = await this.productsModel.getAllProducts();
    // Stockage des produits dans l'attribut data que l'on donne au component TableClassic
    this.querySelector('#dynamicProductSearch').setAttribute('data', JSON.stringify(this.products));
  }

  // Format des données pour le tableau
  formatTable(stocks) {
    return {
      thead: [
        { lib: "Code" },
        { lib: "Libellé" },
        { lib: "PM Euro" },
        { lib: "Valeur Euro" },
        { lib: "Qté Théo." },
        { lib: "Qté Réelle" },
        { lib: "NKP Théo." },
        { lib: "NKP Réel" },
        { lib: "Diff Qté" },
        { lib: "Diff NKP" },
        { lib: "Diff Valeur" }
      ],
      tbody: 
        stocks && stocks.map((stock) => ({
          id: stock.id,
          trData: [
            { tdData: stock.id, type: "", css: "" },
            { tdData: stock.name, type: "", css: "" },
            { tdData: stock.euroAveragePrice, type: "", css: "" },
            { tdData: stock.euroValue, type: "", css: "" },
            { tdData: stock.quantityTheoric, type: "", css: "" },
            { tdData: stock.quantityReal, type: "", css: "" },
            { tdData: stock.nkpTheoric, type: "", css: "" },
            { tdData: stock.nkpReal, type: "", css: "" },
            { tdData: stock.quantityDifference, type: "", css: "" },
            { tdData: stock.nkpDifference, type: "", css: "" },
            { tdData: stock.valueDifference, type: "", css: "" }
          ]
        }))
    };
  }

  filterTable(product) {
    if (product.value && this.stocks) {
      // Filtrage des stocks
      const filteredStocks = this.stocks.filter((stock) => stock.id === product.value);
      // Formatage des stocks filtrés
      const formattedStocks = this.formatTable(filteredStocks);
      // Mise à jour des données du tableau
      this.querySelector('#stocksTable').setAttribute('data', JSON.stringify(formattedStocks));
    }
  }

  setupEventListeners() {    
    this.eventMap.forEach(({ selector, events }) => {
      const element = this.querySelector(selector);
      if (element) {
        // Ajout des écouteurs d'événements
        events.forEach(({ type, handler }) => {
          element.addEventListener(type, handler);
        });
      }
    });
  }

  disconnectedCallback() {
    this.eventMap.forEach(({ selector, events }) => {
      const element = this.querySelector(selector);
      if (element) {
        // Supression des écouteurs d'événements
        events.forEach(({ type, handler }) => {
          element.removeEventListener(type, handler);
        });
      }
    });
  }

  render() {
    this.innerHTML = `
      <main id="main" role="main" class="container-fluid stocks flex flex-col gap-3 h-100">
        
      </main>

      <script></script>
    `;
  }
}
// Définition de l'élément page en tant que component
customElements.define('exemple-page', ExemplePage);