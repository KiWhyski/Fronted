/**
 * @class CareGuide
 * @description Represents a care guide for alcoholic beverages
 */
export class CareGuide {
    /**
     * @param {Object} data - Care guide data
     * @param {string} data.id - Care guide ID
     * @param {string} data.accountId - Account ID
     * @param {string|null} data.productId - Product ID (can be null if not assigned)
     * @param {string} data.title - Title of the care guide
     * @param {string} data.summary - Summary of the care guide
     * @param {number} data.minTemp - Minimum temperature
     * @param {number} data.maxTemp - Maximum temperature
     * @param {string} data.placeStorage - Storage place
     * @param {string} data.recommendation - Recommendation
     */
    constructor({
        id = '',
        accountId = '',
        productId = null,
        title = '',
        summary = '',
        minTemp = 0,
        maxTemp = 0,
        placeStorage = '',
        recommendation = ''
    } = {}) {
        this.id = id;
        this.accountId = accountId;
        this.productId = productId;
        this.title = title;
        this.summary = summary;
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.placeStorage = placeStorage;
        this.recommendation = recommendation;
    }

    validate() {
        if (!this.id) {
            throw new Error('El ID de la guía es requerido');
        }
        if (!this.title) {
            throw new Error('El título de la guía es requerido');
        }
        if (!this.summary) {
            throw new Error('La descripción de la guía es requerida');
        }
        if (!this.minTemp || !this.maxTemp) {
            throw new Error('Los rangos de temperatura deben estar completos');
        }
        if (!this.placeStorage) {
            throw new Error('El lugar de almacenamiento es requerido');
        }
        if (!this.recommendation) {
            throw new Error('La recomendación es requerida');
        }
    }

    /**
     * @returns {Object} Guide data in a format suitable for API
     */
    toJSON() {
        return {
            id: this.id,
            accountId: this.accountId,
            productId: this.productId,
            title: this.title,
            summary: this.summary,
            minTemp: this.minTemp,
            maxTemp: this.maxTemp,
            placeStorage: this.placeStorage,
            recommendation: this.recommendation
        };
    }

    /**
     * @returns {Object} Guide data with parsed details
     */
    toDetailedJSON() {
        const details = this.parseDescription();
        return {
            ...this.toJSON(),
            temperature: details.temperature,
            storage: details.storage,
            duration: details.duration,
            comments: details.comments
        };
    }

    parseDescription() {
        const tempMatch = this.summary.match(/Temperatura recomendada: ([\d-]+°C)/);
        const storageMatch = this.summary.match(/Almacenar en (.+?)\./);
        const durationMatch = this.summary.match(/Duración después de abierto: (.+?)\./);
        const commentsMatch = this.summary.match(/Comentarios: (.+?)(?:\.|$)/);

        return {
            temperature: tempMatch ? tempMatch[1] : 'No especificada',
            storage: storageMatch ? storageMatch[1] : 'No especificado',
            duration: durationMatch ? durationMatch[1] : 'No especificada',
            comments: commentsMatch ? commentsMatch[1] : 'No especificados'
        };
    }
}