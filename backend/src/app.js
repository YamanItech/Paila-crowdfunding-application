import express from "express";
import cors from "cors";
const app = express()
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })

)
//import routes
import healthcheckRoutes from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRoutes);
export {app};