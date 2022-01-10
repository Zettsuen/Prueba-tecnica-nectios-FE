import { Router, Response, Application, Request } from "express";
import { BodyDeserialize, BodyDeserializationBitfield, Authorized, RequestWithJWT } from '../express';
import { DB } from '../main';
import { convertToHash } from '../utils';
import JWT from "jsonwebtoken"
import { uploadFiles } from "../utils/uploadFiles";
import { isExpressionWithTypeArguments } from "typescript";
const bcrypt = require('bcryptjs');

export class UserController {
    #router: Router;
    constructor(app: Application) {
        this.#router = Router()
        this.#router.get("/api/users", this.handleGetUsers.bind(this))
        this.#router.post("/api/users", this.handlePostUsers.bind(this))
        this.#router.post("/api/login", this.handlePostLogin.bind(this))
        app.use(this.#router)
    }

    @Authorized("ADMIN")
    @BodyDeserialize(BodyDeserializationBitfield.URLEncoded | BodyDeserializationBitfield.PostFormURLEncoded)
    async handleGetUsers(req: any, res: Response) {

        const requestData: { email?: string, count?: number, offset?: number, clientKey: string, userID?: number; } = req.body

        const client = (await DB.clients.getClient({ clientKey: requestData.clientKey }))[0]

        const result = await DB.user.getUsers({
            userID: requestData.userID,
            email: requestData.email,
            count: requestData.count,
            offset: requestData.offset,
            client_id: client.id
        }).catch(err => {
            console.log(err)
            res.status(500).send("Internal server error")
            return;
        })
        res.json(result)
    }
    @BodyDeserialize(BodyDeserializationBitfield.JSONPayload
        || BodyDeserializationBitfield.MultipartWithJSON)
    async handlePostUsers(req: RequestWithJWT, res: Response) {

        const requestData: { email: string, name: string, surname: string, password: string, phone?: string, role?: string, clientKey: string } = req.body

        // Filter data

        if (requestData.clientKey == null) {
            res.status(400).send("No client")
            return;
        }

        if (requestData.role != null && requestData.role.toLowerCase() === "admin" && req.jwt.role !== "ADMIN") {
            res.status(400).json({ NoPermission: true })
            return;
        } else if (requestData.role !== "ADMIN") {
            requestData.role = "USER"
        }

        const client = (await DB.clients.getClient({ clientKey: requestData.clientKey }))[0]

        if (client.id == null) {
            res.status(400).json({ ClientDoesntExist: true })
            return;
        }

        // End filter Data

        // Prepare Data

        let url:any = null

        if (req.is('multipart/form-data')) {

            url = await uploadFiles(req, res, null, "profilePhotos")
        }

        requestData.password = convertToHash(requestData.password)

        const data = {
            name: requestData.name,
            surname: requestData.surname,
            password: requestData.password,
            phone: requestData.phone,
            role: requestData.role,
            email: requestData.email,
            profilePhoto: url.fileUrls != null ? url.fileUrls[0] : null,
            client_user: { connect: { id: client.id } }
        }

        // End Prepare Data

        // Send Data

        await DB.user.postUser(data).catch(err => {
            console.log(err)
            res.status(500).send("Internal server error")
            return;
        })

        res.json({ created: "ok" })

    }

    @BodyDeserialize(
        BodyDeserializationBitfield.JSONPayload
    )
    async handlePostLogin(req: RequestWithJWT, res: Response){
        const requestData: {email: string, password: string, clientKey: string} = req.body

        if(requestData.email == null || requestData.password == null || requestData.clientKey == null){
            res.status(400).send("Email, password and clientKey required")
            return;
        }

        const client = (await DB.clients.getClient({ clientKey: requestData.clientKey }))[0]

        if(client.id == null){
            res.status(400).json({ClientDoesntExist: true})
            return;
        }

        const result = (await DB.user.getUsers({email: requestData.email, withPassword: true, client_id: client.id, forLogin: true}))[0].data[0]

        console.log(result)

        const hashedPassword = convertToHash(requestData.password)

        const check = hashedPassword === result.password

        if(check){
            JWT.sign({ sub: result.id, role: result.role }, "SecretWeddoBackend35540", { algorithm: 'HS256'}, (err, token) => {
                if(err){
                    console.log(err)
                }else{
                    res.json(token)
                }
            }); 
        }else{
            res.status(400).send("Invalid data")
            return
        }

    }

    @Authorized("ADMIN")
    @BodyDeserialize(BodyDeserializationBitfield.JSONPayload)
    async handlePutRoleOfUser(req: RequestWithJWT, res: Response){
        const requestData = req.body

        if(requestData.clientKey == null || requestData.userID == null || requestData.role == null || requestData.role !== "ADMIN" && requestData.role !== "USER"){
            res.status(400).json({BadData: true})
            return;
        }

        const clientID = (await DB.clients.getClient({clientKey: requestData.clientKey}))[0].data[0]

        const result: any = await DB.user.putUserRole({
            client_id: clientID,
            id: requestData.userID,
            role: requestData.role
        }).catch(err => {
            console.log(err)
            res.status(500).send("Internal server error")
            return;

        })
        
        res.json(result)


    }

}