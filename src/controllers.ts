import {HealthcareController} from "./controllers/healthcare"
import { Application } from 'express';
import { UserController } from './controllers/users';
import { ProductController } from './controllers/products';
import { CommentController } from './controllers/comments';

export class CordinateControllers{
    constructor(app: Application){
        const hcController = new HealthcareController(app);
        const usController = new UserController(app);
        const prController = new ProductController(app);
        const cmController = new CommentController(app);
    }
}