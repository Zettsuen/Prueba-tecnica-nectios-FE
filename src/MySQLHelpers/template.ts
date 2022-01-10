export class TemplateHelper{

    #sqlDB;

    constructor(prisma: any){
        this.#sqlDB = prisma
    }

    async getTemplate(){
        await this.#sqlDB.users.findMany()
    }

}