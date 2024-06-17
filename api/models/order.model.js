import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = new Schema({
    gigId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      posterId: {
        type: String,
        required: true,
      },
      bidderId: {
        type: String,
        required: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
      payment_intent: {
        type: String,
        required: true,
      }
}, {
    timestamps: true
});

export default mongoose.model("Order", OrderSchema)