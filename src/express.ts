import { RequestHandler, Request, Response } from "express";
import { parse as parseQuery } from "querystring";
import JWT from "jsonwebtoken";
const Busboy = require('busboy');

export enum BodyDeserializationBitfield {
    JSONPayload = 0b00000001,
    URLEncoded = 0b00000010,
    PostFormURLEncoded = 0b00000100,
    ReturnEmptyOnFail = 0b00001000,
    MultipartWithJSON
}

export function BodyDeserialize(options: BodyDeserializationBitfield, maxSize = 1024) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const previousFunc: RequestHandler = descriptor.value
        descriptor.value = (req: Request, res: Response, next: any) => {
            let predictedSize: number = 0;
            try {
                const p: any = req.headers["content-length"]
                predictedSize = parseInt(p);
            } catch (err) { }

            if (options & BodyDeserializationBitfield.MultipartWithJSON && req.headers["content-type"] && req.headers["content-type"].indexOf("multipart/form-data") >= 0) {

                const headers:any = req.headers

                const busboy = Busboy({ headers: headers, highWaterMark: 8 * 1024 });
                let formData = {};
                const files: any[] = []
                const buffers: any = {}

                busboy.on("file", function (field: any, file: any, filename: string, enc: any, mime: any) {
                    buffers[field] = []
                    file.on('data', (data: any) => {
                        buffers[field].push(data)
                    })

                    file.on('end', () => {
                        files.push({
                            fileBuffer: Buffer.concat(buffers[field]),
                            fileType: mime,
                            fileName: filename,
                        })
                    })

                })

                busboy.on('field', (fieldname: any, val: any, fieldnameTruncated: any, valTruncated: any, encoding: any, mimetype: any) => {
                    if (fieldname === "data") {
                        formData = val;
                    }
                });

                busboy.on('finish', () => {
                    const parsedData = JSON.parse(formData.toString());
                    req.body = parsedData;
                    req.body.files = files;
                    if (req.query) {
                        previousFunc(req, res, next);
                    }
                });

                req.pipe(busboy);

            } else if (options & BodyDeserializationBitfield.JSONPayload &&
                ["POST", "PUT", "PATCH"].includes(req.method) &&
                req.headers["content-type"] != undefined &&
                req.headers["content-type"].indexOf("application/json") >= 0) {
                collectStream(req, predictedSize ?? maxSize).then((data) => {
                    try {
                        const parsedData = JSON.parse(data.toString("utf-8"));
                        req.body = parsedData;
                    } catch (err) {
                        res.status(400).send("Bad JSON body");
                        return;
                    }
                    if (req.body) {
                        previousFunc(req, res, next);
                    }
                });
            } else if (options & BodyDeserializationBitfield.URLEncoded &&
                Object.values(req.query).length != 0) {
                req.body = {};
                for (const [key, value] of Object.entries(req.query)) {
                    let formattedValue: any = value;
                    if (/^\d+$/.test(formattedValue)) {
                        formattedValue = parseInt(formattedValue)
                    }

                    req.body[key] = formattedValue;
                }
                previousFunc(req, res, next);
            } else if (options & BodyDeserializationBitfield.PostFormURLEncoded &&
                req.method === "POST" &&
                req.headers["content-type"] === "application/x-www-form-urlencoded") {
                collectStream(req, predictedSize ?? maxSize).then((data) => {
                    try {
                        const parsedData = parseQuery(data.toString("utf-8"));
                        req.body = parsedData;
                    } catch (err) {
                        res.status(400).send("Bad URLEncoded body");
                        return;
                    }
                    if (req.body) {
                        previousFunc(req, res, next);
                    }
                });
            } else if (options & BodyDeserializationBitfield.ReturnEmptyOnFail) {
                req.body = {};
                previousFunc(req, res, next);
            } else {
                res.status(400).send("Couldn't unserialize request");
                return;
            }
        }
    }
}

function collectStream(stream: NodeJS.ReadableStream, maxSize: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let acumulator = Buffer.alloc(0);
        stream.on("data", (data) => {
            if (acumulator.length + data.length > maxSize) {
                reject(new Error(`Stream larger than ${maxSize} for being collected`));
            }
            acumulator = Buffer.concat([acumulator, data]);
        });
        stream.on("end", () => {
            resolve(acumulator);
        })
    });
}

export interface DecodedJWT {
    sub: any,
    role: string
}

export type RequestWithJWT = Request & {
    jwt: DecodedJWT
}

declare global {
    namespace Express {
    interface  Request{
      jwt:DecodedJWT
    }
}
}

export function Authorized(role?: string) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const previousFunc: RequestHandler = descriptor.value
        descriptor.value = (req: RequestWithJWT, res: Response, next: any) => {
            if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
                res.setHeader("WWW-Authenticate", "Bearer realm=\"Copernic OAuth\"")
                    .sendStatus(403);
                return;
            }
            const bearer = req.headers.authorization.substring(7);
            JWT.verify(bearer, "SecretWeddoBackend35540", {
                algorithms: ["HS256"]
            }, (err, jwt) => {
                if (err != null) {
                    res.setHeader("WWW-Authenticate", "Bearer realm=\"Copernic OAuth\", error=\"invalid_token\"")
                        .sendStatus(401);
                } else {
                    if (role != null && jwt?.role !== role) {
                        res.setHeader("WWW-Authenticate", "Bearer realm=\"Copernic OAuth\", error=\"invalid_token\"")
                            .sendStatus(401);
                        return;
                    }
                    req.jwt = jwt as DecodedJWT;
                    previousFunc(req, res, next);
                }
            });

        }
    }
}