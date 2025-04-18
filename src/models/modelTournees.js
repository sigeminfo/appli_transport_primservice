import { ApiService } from "../services/apiService.js";
import { ErrorsHandler } from "../utils/errorsHandler.js";

export class ModelTournees {
    constructor() {
        // Initialisation de l'instance ApiService
        this.apiService = new ApiService();
        // Suffixe pour les requêtes API
        this.apiServiceSuffix = "/beTou";
    }

    async connexion(data) {
        return this.apiService.put(`${this.apiServiceSuffix}/cnx`, data)
        .then((response) => {                    
            // Vérification des erreurs dans la réponse
            if (response._errors) {
                throw response;
            }
            else {
                return response;
            }
        })    // Gestion des erreurs
        .catch((error) => {
            // Appel au gestionnaire d'erreurs
            ErrorsHandler.handleError(error);
            throw error;
        });
    }

    // Méthode pour récupérer tous les produits ici en l'occurence
    async getAllTou() {
        try {
            const resp = await this.apiService.get(`${this.apiServiceSuffix}/getTou`, {});
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp.tournees;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getTouDetails(data) {
        try {
            const resp = await this.apiService.get(`${this.apiServiceSuffix}/getTouDetails`, data);
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getEmbRecap(data) {
        try {
            const resp = await this.apiService.get(`${this.apiServiceSuffix}/getEmbRecap`, data);
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async updateStockEmb(data) {
        try {
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/updateStkEmb`, data);
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async validateDelivery(data) {
        try {
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/updateFacLiv`, data);
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp;
        } catch (error) {
           ErrorsHandler.handleError(error);
           throw error; 
        }
    }

    async updateStatut(data) {
        try {
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/updatePbLiv`, data);
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp;
        } catch (error) {
           ErrorsHandler.handleError(error);
           throw error; 
        }
    }
}