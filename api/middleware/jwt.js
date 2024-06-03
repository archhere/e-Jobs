import get from "lodash.get"
import jwt from "jsonwebtoken";
import { ERROR_INVALID_TOKEN, ERROR_UNAUTHENTICATED, ERROR_UNKNOWN } from "../utils/constants.js";
import { createError } from "../utils/helper.js";

export const verifyToken = (req, res, next) => {
    try {
        const token = get(req, "cookies.accessToken");
        if (token) {
            jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
                if (err) return next(createError(403, ERROR_INVALID_TOKEN));
                req.userId = payload.id;
                req.isSeller = payload.isSeller;
                next();
             })
        } else {
            return next(createError(401, ERROR_UNAUTHENTICATED));
        }
    } catch (err) {
        return next(err);
    }
}