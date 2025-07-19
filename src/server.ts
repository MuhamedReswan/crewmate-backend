import "reflect-metadata";
import "./config/diContainer";
import express, {Application} from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser';
import router from "./routes/router";
import { PORT,CLIENTURL } from "./config/env";
import { connectDB } from "./config/connectDB";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger.util";


const app : Application = express();

app.use(cookieParser());
app.use(cors({
    origin:CLIENTURL,
    methods:["GET","POST","PATCH","DELETE","PUT"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
logger.info("✅ Winston logger is working");


app.get("/", (req,res)=>{
    res.send("server started");
});

app.use("/", router);

app.use(errorHandler);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
