/**
 * Class representing a warehouse amount the bounded context inventory-management.
 * @module warehouse
 * @param {string} warehouseId - The unique identifier of the warehouse.
 * @param {string} name - The name of the warehouse.
 * @param {string} imageUrl - The URL of the image that refers to the warehouse.
 * @param {string} location - The physical location of the warehouse.
 * @param {string} city - The city where the warehouse is located.
 * @param {string} state - The state where the warehouse is located.
 * @param {string} postalCode - The postal code of the warehouse.
 * @param {number} capacity - The physical space the warehouse uses in cubic meters.
 * @param {string} profileId - The ID of the person that owns the warehouse.
 */
export class Warehouse {

    constructor({
        warehouseId = '',
        name = '',
        street ='',
        city = '',
        district = '',
        postalCode = '',
        country = '',
        maxTemperature = 0,
        minTemperature = 0,
        capacity = 0,
        imageUrl = '',
        profileId = ''
                }) {
        this.warehouseId = warehouseId;
        this.name = name;
        this.street = street;
        this.city = city;
        this.district = district;
        this.postalCode = postalCode;
        this.country = country;
        this.maxTemperature = maxTemperature;
        this.minTemperature = minTemperature;
        this.capacity = capacity;
        this.imageUrl = imageUrl;
        this.profileId = profileId;
    }

    get fullAddress() {
        return `${this.street}, ${this.city}, ${this.district}, ${this.postalCode}, ${this.country}`;
    }
}