export class CommentHelper {

    #sqlDB;

    constructor(prisma: any) {
        this.#sqlDB = prisma
    }

    async getComments(options: { count?: number, offset?: number, productID: number, client_id: number }) {

        const filter: any = { orderBy: {}, where: { client_id: options.client_id } }

        filter.where.product_id = { equals: options.productID }

        filter.take = options.count ?? 15
        filter.skip = options.offset ?? 0
        filter.orderBy.id = "desc"

        filter.include = {
            client_product: true
        }

        const query = await this.#sqlDB.comments.findMany(filter)
        let finalData = []
        for(let row of query){
            finalData.push({
                key: row.key,
                description: row.description,
                createdBy: row.client_product
            })
        }
        return [{ data: finalData, count: options.count ?? 15, offset: options.offset ?? 0 }]
    }

    async postComments(options: { description: string, price: number, client_id: number, productID: number, userID: number }) {

        const key = require('uuid').v1()

        const query = await this.#sqlDB.comments.create({
            data: {
                key: key,
                description: options.description,
                client_product: { connect: { id: options.productID } },
                client_users: { connect: { id: options.userID } },
                client_comment: { connect: { id: options.client_id } }
            }
        })

        return query
    }

}