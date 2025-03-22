import mongoose,{Schema} from 'mongoose'
import * as stream from "node:stream";
const paymentSchema = new Schema({
    backerId:{
        type:Schema.Types.ObjectId,
        ref:'Backer'
    },
    pidx:{
        type:String,
        required:true
    },
    total_amount:{
        type:Number,
    },
    transaction_id:{
        type:String,
        required:true
    }
})