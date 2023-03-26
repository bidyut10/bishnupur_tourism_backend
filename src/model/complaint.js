const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
      minLength: 10,
    },
    msg: {
      type: String,
      required: true,
      trim: true,
    },
    isResolved: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
