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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const utils_1 = __importDefault(require("./utils"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
if (config_1.BACKEND_URL) {
    mongoose_1.default
        .connect(config_1.BACKEND_URL)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error(err));
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, username } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.UserModel.create({
            email,
            username,
            password: hashedPassword,
        });
        res.status(200).json({ msg: "Signed Up!" });
    }
    catch (e) {
        console.log(e);
    }
}));
//@ts-ignore
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "User not found!", success: false });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (match) {
            const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, config_1.JWT_USER, { expiresIn: "1d" });
            res.json({
                msg: "Signed in!",
                token: token,
                success: true,
            });
        }
        else {
            return res
                .status(404)
                .json({ msg: "invalid user email or password", success: false });
        }
    }
    catch (e) {
        console.log(e);
    }
}));
//@ts-ignore
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, type, link } = req.body;
    //@ts-ignore
    const userId = req.userId;
    const now = new Date();
    const time = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`;
    try {
        yield db_1.ContentModel.create({
            link,
            title,
            type,
            userId,
            time
        });
        res.json({ msg: "Added" });
    }
    catch (e) {
        console.log(e);
    }
}));
//@ts-ignore
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const contents = yield db_1.ContentModel.find({ userId });
        const contentIds = contents.map((c) => c._id);
        for (let i = 0; i < contents.length; i++) {
            contents[i].id = contentIds[i];
        }
        res.json({ contents });
    }
    catch (e) {
        console.log(e);
    }
}));
//@ts-ignore
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.body;
    //@ts-ignore
    const userId = req.userId;
    try {
        const content = yield db_1.ContentModel.findById(contentId);
        if (!content) {
            res.status(404).json({ msg: "Content not found" });
        }
        if ((content === null || content === void 0 ? void 0 : content.userId.toString()) != userId) {
            res.status(404).json({ msg: "This content doesnt belong to you.." });
        }
        yield db_1.ContentModel.findByIdAndDelete(contentId);
        res.json({ msg: "Delete succeeded" });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ msg: "Something went wrong" });
    }
}));
//@ts-ignore
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    const { share } = req.body;
    try {
        const user = yield db_1.UserModel.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: "User dosen't exists!" });
        }
        const hash = (0, utils_1.default)();
        if (share) {
            yield db_1.linkModel.create({
                hash,
                userId,
            });
            res.json({
                msg: "Updated!",
                hash,
            });
        }
        else {
            yield db_1.linkModel.deleteOne({ userId });
            res.json({
                msg: "Updated!",
            });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ msg: "Server error" });
    }
}));
//@ts-ignore
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const { shareLink } = req.params;
    try {
        const link = yield db_1.linkModel.findOne({ hash: shareLink });
        if (!link)
            return res.status(404).json({ msg: "Invalid or disabled share link" });
        const userId = link.userId;
        const user = yield db_1.UserModel.findById(userId);
        const contents = yield db_1.ContentModel.find({ userId });
        if (!user) {
            return res.status(400).json({ msg: "User dosent exists!" });
        }
        res.status(200).json({
            username: user.username,
            content: contents.map((content) => ({
                id: content._id,
                type: content.type,
                link: content.link,
                title: content.title,
                tags: content.tags,
            })),
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
}));
app.listen(3000, () => console.log("Listening on port 3000"));
