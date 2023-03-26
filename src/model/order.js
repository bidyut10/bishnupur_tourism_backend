const mongoose = require('mongoose')


const OrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
      minLength: 10,
    },
    bookingDate: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    noOfTickets: {
      type: Number,
      required: true,
      default: 1,
      minLength: 1,
      maxLength: 10,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    checkedIn: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
    isCancled: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
    isRefundCompleted: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
    paymentMode: {
      type: String,
      default: "cod",
      enum: ["cod", "online"],
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
