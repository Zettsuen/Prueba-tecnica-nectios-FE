import express from "express"
import { CordinateControllers } from "./controllers"
import { dbCoordinator } from './dbCoordinator';

const App = express()

App.use((req, res, next) => {
    res.on("finish", () => {

        console.log(`${req.method} ${req.url} ${req.ip}:
    Date: ${new Date().toISOString()}
    Content-Length: ${req.headers["content-length"]}
    User-Agent: ${req.headers["user-agent"]}
    X-Forwarded-For: ${req.headers["x-forwarded-for"]}
    Host: ${req.headers["host"]}
    Referer: ${req.headers["referer"]}
    ${res.statusCode} ${res.statusMessage}`);

    })
    next();
});

App.use((err: any, req: any, res: any, next: any) => {
    // Maybe log the error for later reference?
    // If this is development, maybe show the stack here in this response?
    res.status(err.status || 500);
    res.send({
        'message': err.message
    });
});

new CordinateControllers(App)

export const DB = new dbCoordinator();


App.listen(process.env.PORT)
console.log(`Listening port ${process.env.PORT}`)
