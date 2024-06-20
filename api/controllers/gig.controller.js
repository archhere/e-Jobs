import { createError } from "../utils/helper.js";
import { 
    ERROR_GIG_CREATE_ONLY_SELLERS, GIG_ALREADY_DELETED, ERROR_DELETE_NOT_OWN_GIG, 
    DELETED, ERROR_GIG_NOT_FOUND, ERROR_CANNOT_EDIT_NOTOWNED_GIG, ERROR_CANNOT_BID, 
    ERROR_CANNOT_TWICE,
    READY_FOR_REVIEW,
    PAID,
    COMPLETED,
    ERROR_GIG_PAST_DUE
} from "../utils/constants.js";
import Gig from "../models/gig.model.js";
import get from "lodash.get";
import Stripe from "stripe";

export const createGig = async (req, res, next) => {
    try {
        const {isSeller, userId, body} = req;
        const {bidLastDate , projectDeliveryDate} = body;
        const daysToBid = new Date(bidLastDate)?.getTime();
        const daysToDeliver = new Date(projectDeliveryDate)?.getTime();
        if (dayConverter(daysToBid) < 1 || dayConverter(daysToDeliver) < 1) {
            return next(createError(403, ERROR_GIG_PAST_DUE)); //Error for gigs with past dates
        }
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

const dayConverter = (dateToBid) => {
    const today = new Date().getTime();
    const timeinmilisec = dateToBid - today;
    return (timeinmilisec > 0) ? Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24)) : 0;
  }


export const updateGig = async (req, res, next) => {
    try {
        const {params: { id }, query: { isBid }, userId } = req;
        const gig = await Gig.findById(id);
        if (!gig) return next(createError(403, ERROR_GIG_NOT_FOUND));
        if (Date(gig.projectDeliveryDate) > Date.now()) return next(createError(500, ERROR_CANNOT_EDIT_EXPIRED));
        let updatedGig;

        if (isBid?.trim()?.toLowerCase() === "true") { //only bidder flow
            const {query: { bidPrice } } = req;
            const bidAmount = (bidPrice && Number(bidPrice)) || 0;
            if (gig.userId === userId) return next(createError(403, ERROR_CANNOT_BID));
            if (Date(gig.bidLastDate) > Date.now() && isBid) return next(createError(500, ERROR_CANNOT_BID_EXPIRED));
            const { bids } = gig;
            if (bids.includes(userId)) return next(createError(403, ERROR_CANNOT_TWICE));
            updatedGig = await Gig.findByIdAndUpdate({_id: id}, 
                { '$push': { 'bids': {bidder: userId, bidAmount} }, $inc: {totalBids: 1} }
            );
        } else { //only poster flow unless bidder is changing status
            const { body: { status } } = req;
            if (!(status == READY_FOR_REVIEW || status == COMPLETED) && gig.userId !== userId) return next(createError(403, ERROR_CANNOT_EDIT_NOTOWNED_GIG));
            updatedGig = await Gig.findByIdAndUpdate({_id: id}, 
                {
                    $set: {
                        ...req.body 
                     }
                },
                {new: true}
            );
        }
        res.status(200).send(updatedGig);
    } catch(err) {
        next(err);
    }
}

export const intent = async (req, res, next) => {
    try {
        const { params: {id } } = req;
        const stripe = new Stripe(process.env.STRIPE);
        const gig = await Gig.findById(id);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: gig.price * 100,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
              },
        });
        const updatedGig = await Gig.findByIdAndUpdate({_id: id}, 
            {
                $set: { payment_intent: paymentIntent.id}
            },
            {new: true}
        );
        res.status(200).send({clientSecret: paymentIntent.client_secret});
    } catch(err){
        console.log(err)
        next(err);
    }
}

export const confirm = async (req, res, next) => {
    try {
        const { body: { payment_intent } } = req;
        const orders = await Gig.findByIdAndUpdate(
            {
                payment_intent: payment_intent
            }, 
            {
                $set: {status: PAID}
            }
        );
        res.status(200).send(ORDER_CONFIRMED);

    } catch(err){
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
    const {query: {userId, cat, min, max, search, sort, bidder, status}} = req;
    // Using spread operator to 
    const filters = {
        ...(userId && { userId }),
        ...(bidder && { bidder }),
        ...(status && { status }),
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
        const gigs = await Gig.find(filters).sort({ [sort]: -1 });

        res.status(200).send(gigs || []);
    } catch(err) {
        next(err);
    }
}