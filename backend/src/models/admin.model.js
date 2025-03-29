import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
export const Admin = mongoose.model("Admin", adminSchema);
