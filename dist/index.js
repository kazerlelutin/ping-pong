"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const json = require("koa-json");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const registerApp_1 = require("./registerApp");
const { PORT } = process.env, port = PORT || 3900, app = new Koa(), router = new Router(), httpServer = http_1.createServer(), io = new socket_io_1.Server(httpServer, { cors: { origin: "*" } });
httpServer.listen(3905);
// Middlewares
app.use(json());
app.use(cors({ "Access-Control-Allow-Origin": "*" }));
app.use(logger());
app.use(bodyParser());
// Routes
router.get("/", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = "Ping Pong is online !";
}));
router.post("/room/:room", (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { room } = ctx.params, isProtectRoom = registerApp_1.registerApp.find((it) => room.includes(it.prefix));
    if (isProtectRoom) {
        const canAccess = registerApp_1.registerApp
            .find((it) => it.key === ctx.request.header.authorization.replace('Bearer ', ''));
        if (canAccess) {
            io.emit(room, ctx.request.body);
        }
        else {
            ctx.status = 403;
            ctx.body = "interdit";
        }
    }
    else {
        io.emit(room, ctx.request.body);
    }
    ctx.body = { res: "pong" };
}));
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
    console.log(`🐨 run on port ${port}`);
    console.log(`🏓 run on port ${3905}`);
});
