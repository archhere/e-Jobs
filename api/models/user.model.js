import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isSeller: {
    type: Boolean,
    default: false
  },
  img: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  desc: {
    type: String,
    required: false
  },
  skills: {
      type: [String],
      required: false
  },
  cat: {
    type: [String],
    required: false
},
  sales: {
    type: Number,
    default: 0
  },
  star: {
    type: Number,
    required: false,
    default: 1,
    enum:[1,2,3,4,5]
  },
  totalStars: {
    type: Number,
    default: 0
}
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema)