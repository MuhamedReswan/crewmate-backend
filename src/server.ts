import "reflect-metadata";
import express from "express";
import router from "./routes/router";
import morgan from "morgan";
import { PORT } from "./config/env";
import { connectDB } from "./config/connectDB";

const app = express();


// app.use("/", router);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req,res)=>{
    res.send("server started");
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
