import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: String
});

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

const linkSchema = new mongoose.Schema({
  hash: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

const Tag = mongoose.model("Tag", tagSchema);
const UserModel = mongoose.model("User", userSchema);
const linkModel = mongoose.model("Links", linkSchema);
const ContentModel = mongoose.model("Content", contentSchema);

export { Tag, UserModel, linkModel, ContentModel };
