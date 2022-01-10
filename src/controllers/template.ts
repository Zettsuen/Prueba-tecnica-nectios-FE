import { Router, Response, Application } from "express";
import { Authorized, BodyDeserializationBitfield, BodyDeserialize } from '../express';
import { DB } from '../main';

export class TemplateController {
    #router: Router;
    constructor(app: Application){
        this.#router = Router()
        this.#router.get("/api/template", this.handleGetTemplate.bind(this))
        app.use(this.#router)
    }
    @Authorized()
    @BodyDeserialize(
        BodyDeserializationBitfield.JSONPayload ||
        BodyDeserializationBitfield.URLEncoded)
    async handleGetTemplate(req:any, res: Response){
        const result = await DB.healthcare.getHealthCare()
        res.send("OK")
    }
   
}