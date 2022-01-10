export class userHelper{

    #sqlDB;

    constructor(prisma: any){
        this.#sqlDB = prisma
    }

    async getUsers(options:{email?: string, count?: number, offset?: number, withPassword?: boolean, client_id: number, userID?: number, forLogin?: boolean}){

        const filter:any = {orderBy: {}, where:{client_id: options.client_id}}
        if(options.email != null){
            filter.where.email = {equals: options.email}
        }

        if(options.userID != null){
            filter.where.id = {equals: options.userID}
        }

        filter.take = options.count ?? 15
        filter.skip = options.offset ?? 0
        filter.orderBy.id = "desc"

        filter.select = {
            email: true,
            name: true,
            surname: true,
            role: true,
            profilePhoto: true
        }

        if(options.forLogin){
            filter.select.id = true
        }

        if(options.withPassword){
            filter.select.password = true
        }
        

        const query: any[] = await this.#sqlDB.users.findMany(filter)
        return [{data: query, count: options.count ?? 15, offset: options.offset ?? 0}]
    }

    async postUser(data: any){
        const query = await this.#sqlDB.users.create({
            data
        })

        return query
    }

    async putUserRole(data: {client_id: number, id: number, role: string}){
        const role = data.role
        const query = await this.#sqlDB.users.update({where: data, data: {role}})

        return query

    }

}