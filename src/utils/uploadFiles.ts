import AWS from "aws-sdk";
import { randomString } from "../utils";
import "../utils";
import { RequestWithJWT } from '../express';
import { Response } from 'express';
import Busboy from "busboy";

/*const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}*/

export async function uploadFiles(req: RequestWithJWT, res: Response, individualFile = null, folder: string) {
    const requestData = req.query as any;
    if (requestData.cutStartTime) {
        requestData.cutStartTime = parseFloat(req.query.cutStartTime as string);
        if (isNaN(requestData.cutStartTime) || requestData.cutStartTime < 0) {
            return res.status(400).send("cutStartTime must be a positive number");
        }
    }
    if (requestData.cutEndTime) {
        requestData.cutEndTime = parseFloat(req.query.cutEndTime as string);
        if (isNaN(requestData.cutEndTime) || requestData.cutEndTime < 0) {
            return res.status(400).send("cutEndTime must be a positive number");
        }
    }

    const fileKeys = [];
    const fileUrls = [];
    const fileNames = [];
    const filePaths = [];
    const prefixes = [];
    const thumbnails = [];

    const headers: any = req.headers

    const busboy = Busboy({
        headers: headers,
        highWaterMark: 8 * 1024, // Set 8MiB buffer
    });


    let files: any = req.body.files;

    if (individualFile != null) {
        files = individualFile
    }

    for (const file of files) {
        const { fileBuffer, ...fileParams } = file

        let mimetype:string = fileParams.fileType

        //let filename = removeAccents(fileParams.fileName)
        let filename = fileParams.fileName.filename

        const mimeToPrefixLUT = {
            "application/msword": "documents",
            "application/json": "documents",
            "application/vnd.oasis.opendocument.presentation": "documents",
            "application/vnd.oasis.opendocument.spreadsheet": "documents",
            "application/vnd.oasis.opendocument.text": "documents",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "documents",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": "documents",
            "application/pdf": "documents",
            "application/vnd.ms-powerpoint": "documents",
            "application/x-rar-compressed": "documents",
            "application/rtf": "documents",
            "application/vnd.ms-excel": "documents",
            "application/x-7z-compressed": "documents",
            "application/zip": "documents",
            "application": "application",
            "video": "videos-full",
            "video/quicktime": "videos-full",
            "text": "documents",
            "text/vtt": "subtitles",
            "image/gif": "images",
            "image/png": "images",
            "image/jpeg": "images",
            "image/bmp": "images",
            "image/webp": "images",
            "image/PNG": "images",
            "audio/mpeg": "audios",
            "audio/mp3": "audios",
            "audio/aac": "audios",
            "audio/webm": "audios"
        }

        const mimeToTypeLUT = {
            "application/msword": "document",
            "application/json": "document",
            "application/vnd.oasis.opendocument.presentation": "document",
            "application/vnd.oasis.opendocument.spreadsheet": "document",
            "application/vnd.oasis.opendocument.text": "document",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": "document",
            "application/pdf": "document",
            "application/vnd.ms-powerpoint": "document",
            "application/x-rar-compressed": "document",
            "application/rtf": "document",
            "application/vnd.ms-excel": "document",
            "application/x-7z-compressed": "document",
            "application/zip": "document",
            "application": "application",
            "video": "video",
            "video/quicktime": "video",
            "text": "document",
            "text/vtt": "subtitles",
            "image/gif": "photo",
            "image/png": "photo",
            "image/jpeg": "photo",
            "image/bmp": "photo",
            "image/webp": "photo",
            "image/PNG": "photo",
            "audio/mp3": "audio",
            "audio/mpeg": "audio",
            "audio/aac": "audio",
            "audio/webm": "audio"

        }

        let url: string;
        let rand = randomString(20)
        if (individualFile != null) {
            rand = ""
        }
        
        const result = await uploadToS3(fileBuffer, `${folder}/${rand}${filename}`)

        fileNames.push(result.Location.substr(result.Location.lastIndexOf("/") + 1, result.Location.length))
        filePaths.push(result.Location.substr(result.Location.lastIndexOf("merce/") + 6, result.Location.lastIndexOf("/")))

        if (mimetype !== "text/vtt") {
            fileKeys.push(`${folder}/${rand}${filename}`)
            fileUrls.push(result.Location)
        }

        let bucket;
        bucket = `https://weddo-ecommerce/${folder}/${rand}${filename}`

        return {
            fileUrls,
            fileNames,
            filePaths,
        }

    }
}




async function uploadToS3(file: any, url: any) {

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY || "AKIA4SVBCLMV3E7WXTWX",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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"
    });

    let bucket = "weddo-ecommerce";

    const params = {
        Bucket: bucket,
        Key: url,
        Body: file
    } as AWS.S3.PutObjectRequest;

    return s3.upload(params).promise()

}


export function getVerifiedURLFromS3UsingKey(key: string): string {

    try {

        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY || "AKIA4SVBCLMV3E7WXTWX",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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",
            region: "eu-west-3",
            signatureVersion: "v4",
        });

        let bucket = "weddo-ecommerce";

        

        if (key.indexOf("https://") === 0) {
            
                key = key.replace("https://s3.eu-west-3.amazonaws.com/weddo-ecommerce/", "")

            

        }

        const signedUrl = s3.getSignedUrl("getObject", {
            Key: key,
            Bucket: bucket,
            Expires: 1800,
        });

        return signedUrl
    } catch (e) {
        return key
    }
}

