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

    async getImgClient(data) {
        try {
            const response = await fetch(`admin/api.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (response._errors) {
                throw new Error(resp._errors);
            }
            return response.json();
        } catch (error) {
            ErrorsHandler.handleError(error);
            throw error;
        }
    }

    async compULImage(file, facNbl) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxWidth = 1500;
                    const maxHeight = 1500;
                
                    let newWidth = img.width;
                    let newHeight = img.height;
    
                    if (img.width > maxWidth) {
                        newWidth = maxWidth;
                        newHeight = (img.height * maxWidth) / img.width;
                    }
    
                    if (newHeight > maxHeight) {
                        newHeight = maxHeight;
                        newWidth = (img.width * maxHeight) / img.height;
                    }
    
                    canvas.width = newWidth;
                    canvas.height = newHeight;
    
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                    const compressedImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    console.log(compressedImageBase64);
                
                    const mimeString = compressedImageBase64.split(',')[0].split(':')[1].split(';')[0];
                    const byteCharacters = atob(compressedImageBase64.split(',')[1]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                
                    const blob = new Blob([byteArray], { type: mimeString });
                    //const fileName = 'comp'+file.name;
                    const fileName = facNbl + 'compressed.jpg';
                    const image = new File([blob], fileName, { type: mimeString });
                
                    let form_data = new FormData();
                    form_data.append('file', image);
                    form_data.append('filename', facNbl);

                    // Remplacement de $.ajax par fetch
                    fetch('admin/media/web/tournee/upload/img.php', {
                        method: 'POST',
                        body: form_data
                    })
                    .then(response => response.text())
                    .then(data => {
                        console.log('uploaded');
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'upload :', error);
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }
}