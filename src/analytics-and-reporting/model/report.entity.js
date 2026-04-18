export class Report {
    constructor({ id, products, type, price, amount, date, lost }) {
        this.id = id || null
        this.products = products || ''
        this.type = type || ''
        this.price = parseFloat(price || 0)
        this.amount = parseInt(amount || 0)
        this.date = date || new Date().toISOString().split('T')[0]
        this.lost = parseFloat(lost || 0)
    }

    // Calcula el total del reporte
    get total() {
        return this.price * this.amount
    }

    // Calcula el porcentaje de pérdida
    get lossPercentage() {
        if (this.total === 0) return 0
        return (this.lost / this.total) * 100
    }

    // Valida si el reporte es válido
    isValid() {
        return (
            this.products &&
            this.type &&
            this.price > 0 &&
            this.amount > 0 &&
            this.date &&
            this.lost >= 0
        )
    }

    // Convierte el objeto a formato para el API
    toAPI() {
        return {
            id: this.id,
            products: this.products,
            type: this.type,
            price: this.price,
            amount: this.amount,
            date: this.date,
            lost: this.lost
        }
    }

    // Crea una copia del reporte
    clone() {
        return new Report(this.toAPI())
    }
}