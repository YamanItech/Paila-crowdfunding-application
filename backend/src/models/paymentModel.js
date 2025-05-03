import mongoose, {Schema} from "mongoose";
const transactionSchema = new mongoose.Schema(
    {
        customerDetails: {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },
        product_id: {
            type:Schema.Types.ObjectId,
            ref:"Project"
        },

        backer_id:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        amount: {
            type: Number,
            required: true,
        },
        perk:{
            type:Number,
        },
        payment_gateway: {
            type: String,
            required: true,
            enum: ["esewa", "khalti"],
        },
        UUID:{
            type:String
        },
        status: {
            type: String,
            required: true,
            enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);
const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
