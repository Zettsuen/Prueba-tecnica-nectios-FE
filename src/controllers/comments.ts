import { Router, Response, Application } from "express";
import { Authorized, BodyDeserializationBitfield, BodyDeserialize, RequestWithJWT } from '../express';
import { DB } from '../main';

export class CommentController {
    #router: Router;
    constructor(app: Application){
        this.#router = Router()
        this.#router.get("/api/comments", this.handleGetComments.bind(this))
        this.#router.post("/api/comments", this.handlePostComments.bind(this))
        app.use(this.#router)
    }
    @Authorized()
    @BodyDeserialize(
        BodyDeserializationBitfield.URLEncoded)
    async handleGetComments(req:any, res: Response){

        const requestData = req.body;

        const client = (await DB.clients.getClient({ clientKey: requestData.clientKey }))[0]
        let productID = null;
        try{
        productID = (await DB.products.getProducts({productKey: requestData.productKey, client_id: client.id, count: 1}))[0].data[0].id
        }catch(e){
            console.log(e)
        }

        if (client.id == null) {
            res.status(400).json({ ClientDoesntExist: true })
            return;
        }

        if(productID == null){
            res.status(400).json({ ProductDoesntExist: true })
            return;
        }

        const result = await DB.comments.getComments({
            count: requestData.count,
            offset: requestData.offset,
            productID: productID,
            client_id: client.id
        })
        res.send(result)
    }

    @Authorized()
    @BodyDeserialize(
        BodyDeserializationBitfield.JSONPayload)
    async handlePostComments(req:RequestWithJWT, res: Response){

        const requestData = req.body;

        const client = (await DB.clients.getClient({ clientKey: requestData.clientKey }))[0]

        let productID = null;
        try{
        productID = (await DB.products.getProducts({productKey: requestData.productKey, client_id: client.id, count: 1}))[0].data[0].id
        }catch(e){
            console.log(e)
        }

        if (client.id == null) {
            res.status(400).json({ ClientDoesntExist: true })
            return;
        }

        if(productID == null){
            res.status(400).json({ ProductDoesntExist: true })
            return;
        }

        console.log(req.jwt)

        const result = await DB.comments.postComments({
            description: requestData.description,
            price: requestData.price,
            userID: parseInt(req.jwt.sub),
            productID: productID,
            client_id: client.id
        })
        res.send(result)
    }
   
}