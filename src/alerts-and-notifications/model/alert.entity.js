export class StockAlert {
    constructor({ id, name, stock, minStock }) {
        this.id = id;
        this.name = name;
        this.stock = stock;
        this.minStock = minStock;
    }

    get isCritical() {
        return this.stock < this.minStock;
    }
}

export class ExpirationAlert {
    constructor({ id, name, expiresIn }) {
        this.id = id;
        this.name = name;
        this.expiresIn = expiresIn;
    }

    get isExpiringSoon() {
        return this.expiresIn <= 15;
    }
}
