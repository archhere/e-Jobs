import { createError } from "../utils/helper.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import { ERROR_CANNOT_ORDER_OWN_GIG, ORDER_CONFIRMED } from "../utils/constants.js";
import Stripe from "stripe";


export const createOrder = async (req, res, next) => {
    try {
        const { params: {gigId }, userId } = req;
        const gig = await Gig.findById(gigId);
        if (userId === gig.userId) {
            return next(createError(403,  ERROR_CANNOT_ORDER_OWN_GIG));
        }
        const newOrder = new Order({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: userId,
            sellerId: gig.userId,
            price: gig.price,
            payment_intent: "temp_str"
        });
        await newOrder.save();
        res.status(200).send("successful");
    } catch(err){
        next(err);
    }
}

export const getOrders = async (req, res, next) => {
    try {
        const {isSeller, userId} = req;
        const orders = await Order.find({
            ...(isSeller ? {sellerId: userId} : {buyerId: userId}),
            isCompleted: true
        });
        res.status(200).send(orders);
    } catch(err){
        next(err);
    }
}

export const intent = async (req, res, next) => {
    try {
        console.log("adahdhjad", req.params)
        const { params: {id }, userId } = req;
        const stripe = new Stripe(process.env.STRIPE);
        const gig = await Gig.findById(id);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: gig.price * 100,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
              },
        });

        if (userId === gig.userId) {
            return next(createError(403,  ERROR_CANNOT_ORDER_OWN_GIG));
        }
        const newOrder = new Order({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: userId,
            sellerId: gig.userId,
            price: gig.price,
            payment_intent: paymentIntent.id
        });
        await newOrder.save();
        res.status(200).send({clientSecret: paymentIntent.client_secret});
    } catch(err){
        next(err);
    }
}

export const confirm = async (req, res, next) => {
    try {
        const { body: { payment_intent } } = req;
        const orders = await Order.findOneAndUpdate(
            {
                payment_intent
            }, 
            {
                $set: {isCompleted: true}
            }
        );
        res.status(200).send(ORDER_CONFIRMED);

    } catch(err){
        next(err);
    }
}