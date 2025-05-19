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

    // Méthode pour récupérer toutes les tournées
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

    async getPal() {
        try {
            const resp = await this.apiService.get(`${this.apiServiceSuffix}/getPal`, {});
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp.palettes;
        }
        catch (error) {
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

    async getCamions() {
        try {
            const resp = await this.apiService.get(`${this.apiServiceSuffix}/getCam`, {});
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp.camions;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async getPalRecap(data) {
        try {
            const resp = await this.apiService.get(`${this.apiServiceSuffix}/getPalRecap`, data);
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp;
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async updateStockPal(data) {
        try {
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/updateStkPalettes`, data);
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

    async updateCamion(data) {
        try {
            const resp = await this.apiService.put(`${this.apiServiceSuffix}/updateCamion`, data);
            if (resp._errors) {
                throw new Error(resp._errors);
            }
            return resp;        
        } 
        catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }

    }
}