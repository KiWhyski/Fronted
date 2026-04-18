import {generateUuid} from "../../shared/model/uuid.js";
import {ValidationError} from "../../shared/model/errors.js";

export class ProductMovement {
    constructor({
                    product=null,
                    movementType='',
                    productAmount=0,
                    movementDate=null
                })
    {
        if (productAmount <= 0) {
            throw ValidationError('Product amount must be a positive number.')
        }

        this.id = generateUuid();
        this.product = product;
        this.movementType = movementType;
        this.productAmount = productAmount;
        this.movementDate = movementDate;
    }
}