export class healthCareHelper{

    #sqlDB;

    constructor(prisma: any){
        this.#sqlDB = prisma
    }

    async getHealthCare(){
        await this.#sqlDB.users.findMany()
    }

}