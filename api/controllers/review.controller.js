import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import { createError } from "../utils/helper.js";
import { ERROR_SELLERS_CANT_CREATE_REVIEW, ERROR_ALREADY_REVIEWED } from "../utils/constants.js"


export const createReview = async (req, res, next) => {
    try {
        const {isSeller, userId, body: {desc, star, gigId}} = req;
        if (isSeller) return next(createError(403,  ERROR_SELLERS_CANT_CREATE_REVIEW));
        const newReview = new Review({
            userId,
            gigId,
            desc,
            star
        })
        const review = await Review.findOne({
            gigId, userId
        })
        if (review) return next(createError(404, ERROR_ALREADY_REVIEWED));
        const savedReview = await newReview.save();

        await Gig.findByIdAndUpdate(gigId, {$inc: {totalStars: star, starNumber: 1}})
        res.status(201).send(savedReview);
        
    } catch (error) {
        next(error);
    }
}

export const getReviews = async (req, res, next) => {
    try {
        const {params: { gigId }} = req;
        const reviews = await Review.find({gigId})
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