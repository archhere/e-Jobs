import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_CREATED, ERROR_INVALID_USERNAME_PWD, ACCESS_TOKEN, LOGGED_OUT_SUCCESS } from "../utils/constants.js";
import { createError } from "../utils/helper.js";

export const register =  async (req, res, next) => {
    try {
        const {password} = req.body;
        const hash = bcrypt.hashSync(password, 5);
        const newUser = new User({
            ...req.body,
            password: hash,
        })
        await newUser.save();
        res.status(201).send(USER_CREATED);
    } catch(err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                id: user._id,
                isSeller: user.isSeller
            }, process.env.JWT_KEY);
            const {password, ...info} = user._doc;
            return res
                .cookie(ACCESS_TOKEN, token, {httpOnly: true})
                .status(200)
                .send(info);
        } else {
            next(createError(404, ERROR_INVALID_USERNAME_PWD));
        }
    } catch(err) {
        next(err);
    }
}

export const logout = (req, res) => {
    res.clearCookie(ACCESS_TOKEN, {
        sameSite: "none",
        secure: true
    }).status(200).send(LOGGED_OUT_SUCCESS);
}