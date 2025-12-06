import "reflect-metadata";
import { container } from "tsyringe";
import { Server } from "./server";
import dotenv from "dotenv";

dotenv.config();
container.resolve(Server);



