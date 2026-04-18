import {generateUuid} from "@/shared/model/uuid.js";
import {Product} from "./product.entity.js";
import {ValidationError} from "@/shared/model/errors.js";

/**
 * @constructor
 * Represents the inventory with a location in the store of the owner
 * @param name {string} - The name the owner gives to the inventory.
 * @param imageUrl {string} - The URL of the image that refers to the inventory.
 * @param description {string} - A little description about the inventory the owner gives.
 * @param location {string} - The physical location in the store of the owner where the inventory is located.
 * @param alertLevel {string} - The alert level of the inventory. It depends on whether it has a low or a high number of products near to expire.
 * @param products {Product[]} - The list of products stored in this inventory.
 * @param capacity {number} - The physical space the inventory uses in cubic meters.
 * @param userId {string} - The ID of the person that owns the inventory.
 */
export class Inventory {
    constructor({
                    name='',
                    imageUrl='',
                    description='',
                    location='',
                    alertLevel='',
                    products=[],
                    capacity='',
                    userId=''
                })
    {
        if (capacity <= 0) {
            throw ValidationError('Capacity of inventory must be a positive number.')
        }

        this.id = generateUuid();
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
        this.location = location;
        this.alertLevel = alertLevel;
        this.products = products;
        this.capacity = capacity;
        this.userId = userId;
    }

    getTotalNumberOfProducts() {
        return this.products.length;
    }
}