import { autoInjectable } from "tsyringe";
import express, { Application } from "express";
import Routers from "../Routes/router";
import DbConnections from "../Databases/connection";
import { AppConfig } from "../Config/appConfig";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import SocketConnection from "../Socket/socket";


@autoInjectable()
export class Server {

    private app: Application;
    private server: http.Server;


    constructor(private router: Routers,
        private dbConnections: DbConnections,
        private socketConnection: SocketConnection
    ) {

        this.app = express();
        this.server = http.createServer(this.app);
        this.StartServer();

    }

    private StartServer() {

        this.SetupMiddleWares();
        this.DatabaseConnection();
        this.SetupRoutes();
        this.server.listen(AppConfig.serverPort, () => {
            console.log(`✅ Server is running on PORT : ${AppConfig.serverPort}`);
        })
    }

    private SetupRoutes() {
        const mainRoutes = this.router.getRoutes();
        this.app.use("/api", mainRoutes);
    }


    private SetupMiddleWares() {
        this.app.use(cookieParser());
        this.app.use(helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
            contentSecurityPolicy: false
        }));

        this.app.use(
            cors({
                origin: [process.env.FRONTEND_URI!, "http://localhost:5173"],
                credentials: true,
                methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
                allowedHeaders: ["Content-Type", "Authorization"],
            })
        );

        this.app.use(express.json());
        this.app.use(bodyParser.json());
        this.app.use(express.urlencoded({ extended: true }));
        // this.app.use(express.static(publicFolderPath));

        this.socketConnection.establishConnection(this.server);

    }

    private async DatabaseConnection() {
        await this.dbConnections.GetMongodbConnection();

    }


}