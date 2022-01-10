import { Router, Response, Application } from "express";
import { Authorized, BodyDeserializationBitfield, BodyDeserialize } from '../express';
import { DB } from '../main';

export class ProductController {
    #router: Router;
    constructor(app: Application){
        this.#router = Router()
        this.#router.get("/api/products", this.handleGetProducts.bind(this))
        this.#router.post("/api/products", this.handlePostProducts.bind(this))
        app.use(this.#router)
    }
    @Authorized()
    @BodyDeserialize(
        BodyDeserializationBitfield.URLEncoded)
    async handleGetProducts(req:any, res: Response){
        const requestData = req.body;

        const client = (await DB.clients.getClient({ clientKey: requestData.clientKey }))[0]

        if (client.id == null) {
            res.status(400).json({ ClientDoesntExist: true })
            return;
        }

        const result = await DB.products.getProducts({
            count: requestData.count,
            offset: requestData.offset,
            client_id: client.id,
            productKey: requestData.productKey
        })

        res.json(result)

    }

    @Authorized()
    @BodyDeserialize(
        BodyDeserializationBitfield.JSONPayload)
    async handlePostProducts(req:any, res: Response){
        const requestData = req.body;

        const client = (await DB.clients.getClient({ clientKey: requestData.clientKey }))[0]

        if (client.id == null) {
            res.status(400).json({ ClientDoesntExist: true })
            return;
        }

        if(requestData.name == null|| requestData.price == null){
            res.status(400).json({NameAndPriceRequired: true})
            return;
        }

        const result = await DB.products.postProducts({
            client_id: client.id,
            name: requestData.name,
            description: requestData.description,
            price: requestData.price
        })

        res.json(result)

    }
   
}