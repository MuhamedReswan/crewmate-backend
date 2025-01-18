import express from "express";
import router from "./routes/router";
import { connectDB } from "./config/connectDB";
const app = express();
const port = 3000;

// app.use("/", router);

app.get("/", (req,res)=>{
    res.send("server started");
})

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
