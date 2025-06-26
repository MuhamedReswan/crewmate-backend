"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./config/diContainer");
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const connectDB_1 = require("./config/connectDB");
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.CLIENTURL,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("server started");
});
app.use("/", router_1.default);
app.use(errorHandler_1.errorHandler);
(0, connectDB_1.connectDB)().then(() => {
    app.listen(env_1.PORT, () => {
        console.log(`Server is running on http://localhost:${env_1.PORT}`);
    });
});
