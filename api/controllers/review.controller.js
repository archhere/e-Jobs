import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import { createError } from "../utils/helper.js";
import User from "../models/user.model.js";
import { ERROR_SELLERS_CANT_CREATE_REVIEW, ERROR_ALREADY_REVIEWED } from "../utils/constants.js"


export const createReview = async (req, res, next) => {
    const reviewerId = req?.userId;
    const revieweeId = req?.body?.userId;
    const star = req?.body?.star;
    try {
        const newReview = new Review({
            reviewerId,
            revieweeId,
            desc: req.body.desc ,
            star
        });
        const review = await Review.findOne({
            reviewerId, revieweeId
        });
        if (review) return next(createError(404, ERROR_ALREADY_REVIEWED));
        const savedReview = await newReview.save();

        await User.findByIdAndUpdate(revieweeId, {$inc: {totalStars: star, starNumber: 1}})

        res.status(201).send(savedReview);
        
    } catch (error) {
        console.log("aafaf", error)
        next(error);
    }
}

export const getReviews = async (req, res, next) => {
    try {
        const {params: { userId }} = req;
        const reviews = await Review.find({revieweeId: userId})
        res.status(200).send(reviews);
    } catch(err) {
        next(error);
    }
}

export const deleteReview = (req, res, next) => {
    try {

    } catch(err) {
        next(error);
    }
}