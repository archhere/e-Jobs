import { createError } from "../utils/helper.js";
import { 
    ERROR_GIG_CREATE_ONLY_SELLERS, GIG_ALREADY_DELETED, ERROR_DELETE_NOT_OWN_GIG, 
    DELETED, ERROR_GIG_NOT_FOUND
} from "../utils/constants.js";
import Gig from "../models/gig.model.js";
import get from "lodash.get";

export const createGig = async (req, res, next) => {
    try {
        const {isSeller, userId, body} = req;
        if (!isSeller) return next(createError(403, ERROR_GIG_CREATE_ONLY_SELLERS));
        const newGig = new Gig({
            ...body,
            userId,
        })
        const savedGig = await newGig.save();
        res.status(201).json(savedGig);
    } catch(err) {
        next(err);
    }
}

export const deleteGig = async (req, res, next) => {
    try {
        const id = get(req, "params.id");
        const gig = await Gig.findById(id);
        if (!gig) {
            res.status(200).send(GIG_ALREADY_DELETED );
        } else if (req.userId !== gig.userId) {
            next(createError(403, ERROR_DELETE_NOT_OWN_GIG));
        } else {
            await Gig.findByIdAndDelete(id);
            res.status(200).send(DELETED);
        }
    } catch(err) {
        next(err);
    }
}

export const getGig = async (req, res, next) => {
    try {
        const id = get(req, "params.id");
        const gig = await Gig.findById(id);
        if (!gig) {
            next(createError(404, ERROR_GIG_NOT_FOUND));
        } else {
            res.status(200).send(gig);
        } 
    } catch(err) {
        next(err);
    }
}

export const getGigs = async (req, res, next) => {
    const {query: {userId, cat, min, max, search}} = req;
    // Using spread operator to 
    const filters = {
        ...(userId && { userId }),
        ...(cat && { cat }),
        ...(( min || max) && {
        price: {
            ...(min && { $gt: min }),
            ...(max && { $lt: max }),
        },
        }),
        ...(search && { title: { $regex: search, $options: "i" } }),
    };
    try {
        const gigs = await Gig.find(filters).sort({ [req.query.sort]: -1 });

        res.status(200).send(gigs || []);
    } catch(err) {
        next(err);
    }
}