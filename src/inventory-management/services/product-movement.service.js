import {BaseService} from "../../shared/services/base.service.js";

/**
 * @class ProductMovementService
 * @description Service class for handling CRUD operations on categories using HTTP requests
 */
export class ProductMovementService extends BaseService {
    super();

    /** @type {string} The API endpoint for product movements */
    resourceEndpoint = import.meta.env.VITE_PRODUCT_MOVEMENTS_ENDPOINT_PATH;
}