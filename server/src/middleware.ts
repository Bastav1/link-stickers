import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_PASSWORD="bwg,kreqngm,me,bmr"

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const temp=header?.split(" ")[1];

    const decoded = jwt.verify(temp as string, JWT_PASSWORD)
    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are logged in"
            })
            return;    
        }
        //@ts-ignore
        req.userId = (decoded as JwtPayload).id;
        next()
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}