import mongoose from 'mongoose';
const { Schema } = mongoose;
import { OPEN_BID, WIP, READY_FOR_REVIEW, APPROVED, COMPLETED, PAID } from '../utils/constants.js';

const GigSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    cat: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    features: {
        type: [String],
        required: true
    },
    bidLastDate: {
        type: Date,
        required: true
    },
    projectDeliveryDate: {
        type: Date,
        required: true
    },
    bids: {
        type: [{
            bidder : String,
            bidAmount : Number
        }],
        required: false
    },
    totalBids: {
        type: Number,
        default: 0
    },
    bidder: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        required: false,
        default: OPEN_BID,
        enum:[OPEN_BID, WIP, READY_FOR_REVIEW, APPROVED, PAID, COMPLETED]
    },
    payment_intent: {
        type: String,
        default: "temp"
    }
}, {
    timestamps: true
});

export default mongoose.model("Gig", GigSchema)