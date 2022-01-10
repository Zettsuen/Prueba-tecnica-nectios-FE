export class clientHelper{

    #sqlDB;

    constructor(prisma: any){
        this.#sqlDB = prisma
    }

    async getClient(options: {clientKey: string}){

        const filter: any = {where: {}}

        if(options.clientKey != null){
            filter.where.key = options.clientKey
        }

        return await this.#sqlDB.clients.findMany(filter)
    }

}