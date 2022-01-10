import { PrismaClient } from '@prisma/client'
import { healthCareHelper } from './MySQLHelpers/healthcare'
import { userHelper } from './MySQLHelpers/users';
import { clientHelper } from './MySQLHelpers/clients';
import { ProductHelper } from './MySQLHelpers/products';
import { CommentHelper } from './MySQLHelpers/comments';


const prisma = new PrismaClient()


export class dbCoordinator{

    readonly healthcare: healthCareHelper;
    readonly user: userHelper;
    readonly clients: clientHelper;
    readonly products: ProductHelper;
    readonly comments: CommentHelper;

    constructor(){
        this.healthcare = new healthCareHelper(prisma);
        this.user = new userHelper(prisma);
        this.clients = new clientHelper(prisma);
        this.products = new ProductHelper(prisma);
        this.comments = new CommentHelper(prisma);

        if(process.env.MYSQL_PASSWORD != null && process.env.MYSQL_PASSWORD.length > 0){
            process.env.MYSQL_PASSWORD = ":" + process.env.MYSQL_PASSWORD;
        }
        
        process.env.DATABASE_URL=`mysql://${process.env.MYSQL_USER}${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DB}`

    }
}