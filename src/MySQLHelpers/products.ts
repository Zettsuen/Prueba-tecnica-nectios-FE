export class ProductHelper {

    #sqlDB;

    constructor(prisma: any) {
        this.#sqlDB = prisma
    }

    async getProducts(options: { count?: number, offset?: number, productKey?: string, client_id: number }) {

        const filter: any = { orderBy: {}, where: { client_id: options.client_id } }
        if (options.productKey != null) {
            filter.where.key = { equals: options.productKey }
        }

        filter.take = options.count ?? 15
        filter.skip = options.offset ?? 0
        filter.orderBy.id = "desc"

        const query = await this.#sqlDB.products.findMany(filter)
        return [{ data: query, count: options.count ?? 15, offset: options.offset ?? 0 }]
    }

    async postProducts(options: { name: string, description?: string, price: number, client_id: number }) {

        const key = require('uuid').v1()

        const query = await this.#sqlDB.products.create({
            data: {
                key: key,
                name: options.name,
                description: options.description,
                price: options.price,
                client_product: { connect: { id: options.client_id } }
            }
        })

        return query
    }

}