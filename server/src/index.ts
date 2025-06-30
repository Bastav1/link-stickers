import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Tag, UserModel, ContentModel, linkModel } from "./db";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import random from "./utils";
import cors from "cors";
import { JWT_USER,BACKEND_URL } from "./config";


if(BACKEND_URL){
  mongoose
  .connect(BACKEND_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
}


const app = express();
app.use(cors());

app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      email,
      username,
      password: hashedPassword,
    });
    res.status(200).json({ msg: "Signed Up!" });
  } catch (e) {
    console.log(e);
  }
});

//@ts-ignore
app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "User not found!", success: false });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_USER as string,
        { expiresIn: "1d" }
      );

      res.json({
        msg: "Signed in!",
        token: token,
        success: true,
      });
    } else {
      return res
        .status(404)
        .json({ msg: "invalid user email or password", success: false });
    }
  } catch (e) {
    console.log(e);
  }
});

//@ts-ignore
app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { title, type, link } = req.body;
  //@ts-ignore
  const userId = req.userId;
  const now=new Date();
  const time= `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`
  try {
    await ContentModel.create({
      link,
      title,
      type,
      userId,
      time
    });
    res.json({ msg: "Added" });
  } catch (e) {
    console.log(e);
  }
});

//@ts-ignore
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  try {
    const contents = await ContentModel.find({ userId });
    const contentIds = contents.map((c) => c._id);
    for (let i = 0; i < contents.length; i++) {
      contents[i].id = contentIds[i];
    }
    res.json({ contents });
  } catch (e) {
    console.log(e);
  }
});

//@ts-ignore
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const { contentId } = req.body;
  //@ts-ignore
  const userId = req.userId;

  try {
    const content = await ContentModel.findById(contentId);
    if (!content) {
      res.status(404).json({ msg: "Content not found" });
    }
    if (content?.userId.toString() != userId) {
      res.status(404).json({ msg: "This content doesnt belong to you.." });
    }
    await ContentModel.findByIdAndDelete(contentId);
    res.json({ msg: "Delete succeeded" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

//@ts-ignore
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const { share } = req.body;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User dosen't exists!" });
    }
    const hash = random();
    if (share) {
      await linkModel.create({
        hash,
        userId,
      });
      res.json({
        msg: "Updated!",
        hash,
      });
    } else {
      await linkModel.deleteOne({ userId });
      res.json({
        msg: "Updated!",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: "Server error" });
  }
});

//@ts-ignore
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  //@ts-ignore
  const { shareLink } = req.params;
  try {
    const link = await linkModel.findOne({ hash: shareLink });
    if (!link)
      return res.status(404).json({ msg: "Invalid or disabled share link" });
    const userId = link.userId;
    const user = await UserModel.findById(userId);
    const contents = await ContentModel.find({ userId });
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.listen(3000, () => console.log("Listening on port 3000"));
