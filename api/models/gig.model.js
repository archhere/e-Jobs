import mongoose from 'mongoose';
const { Schema } = mongoose;

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
        type: [String],
        required: false
    },
    bidder: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

export default mongoose.model("Gig", GigSchema)