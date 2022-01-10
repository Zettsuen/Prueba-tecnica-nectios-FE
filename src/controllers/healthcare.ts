import { Router, Response, Application } from "express";
import { DB } from '../main';

export class HealthcareController {
    #router: Router;
    constructor(app: Application){
        this.#router = Router()
        this.#router.get("/api/healthcheck", this.handleHealthCheck.bind(this))
        app.use(this.#router)
    }

    async handleHealthCheck(req:any, res: Response){
        const result = await DB.healthcare.getHealthCare()
        res.send("OK")
    }
   
}