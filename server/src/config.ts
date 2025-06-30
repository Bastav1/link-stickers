import dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = process.env.MONGO_URL;
const JWT_USER = process.env.JWT_SECRET;
export { JWT_USER, BACKEND_URL };
