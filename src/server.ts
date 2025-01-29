import "reflect-metadata";
import "./config/diContainer";
import express, {Application} from "express";
import router from "./routes/router";
import morgan from "morgan";
import { PORT,CLIENTURL } from "./config/env";
import { connectDB } from "./config/connectDB";
import cors from "cors"
import { errorHandler } from "./middleware/errorHandler";


const app : Application = express();


app.use(cors({
    origin:CLIENTURL,
    methods:["GET","POST","PATCH","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res)=>{
    res.send("server started");
})

app.use("/", router);

app.use(errorHandler);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
