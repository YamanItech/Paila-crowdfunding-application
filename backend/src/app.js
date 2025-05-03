import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import healthcheckRoutes from "./routes/healthcheck.routes.js";
import userRouters from "./routes/user.routers.js";
import projectRouters from "./routes/project.routers.js"
import perkRouters from"./routes/perk.routers.js"
import paymentRoutes from "./routes/PaymentRoutes.js";
app.use("/api/v1/healthcheck", healthcheckRoutes);
app.use("/api/v1/users", userRouters);
app.use("/api/v1/company/",projectRouters);
app.use("/api/v1/project/",perkRouters);
app.use("/api", paymentRoutes);

export {app};