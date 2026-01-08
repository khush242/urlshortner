import mongoose, { model } from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    expiryAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    clicks:{
      type:Number,
      default:0,
      index:true,
    }
  },
  { timestamps: true }
);

export const Url = model("Url", urlSchema);
