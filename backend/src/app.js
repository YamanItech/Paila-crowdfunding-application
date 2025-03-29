import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express()
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })

)
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173'  ,
    credentials: true 
  }));

//import routes
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import userRouters from "./routes/user.routers.js";
import projectRouters from "./routes/project.routers.js"
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/users", userRouters);
app.use("/api/v1/company/",projectRouters);
export {app};