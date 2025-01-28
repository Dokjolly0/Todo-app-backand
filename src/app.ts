import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import apiRouter from "./api/routes";
import { errorHandlers } from "./errors";
import "./utils/auth/auth-handlers";

const app = express();
app.use(cors());
app.use(morgan("tiny"));
// Aumenta il limite di dimensione per le richieste POST a 10MB
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/todoapp", apiRouter);
app.use(errorHandlers);

export default app;
