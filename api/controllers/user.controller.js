import get from "lodash.get";
import User from "../models/user.model.js";
import { ERROR_UNKNOWN, DELETED, ERROR_DELETE_NOT_OWN_ACCOUNT, USER_ALREADY_DELETED } from "../utils/constants.js";
import { createError } from "../utils/helper.js";

export const deleteUser =  async (req, res, next) => {
    try {
        const id = get(req, "params.id");
        const user = await User.findById(id);
        if (!user) {
            res.status(200).send(USER_ALREADY_DELETED);
        } else if (req.userId !== user._id.toString()) {
            next(createError(403, ERROR_DELETE_NOT_OWN_ACCOUNT));
        } else {
            await User.findByIdAndDelete(id);
            res.status(200).send(DELETED);
        }
    } catch (error) {
        res.status(500).send(`${ERROR_UNKNOWN}`);
    }
}