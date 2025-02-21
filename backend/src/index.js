import dotenv from "dotenv";
import {app} from "./app.js";
dotenv.config({
  path: "src/.env"
});
const port = process.env.PORT || 8001;
app.listen(port,()=>{
    console.log(`Server is running on port ${port} `);
});