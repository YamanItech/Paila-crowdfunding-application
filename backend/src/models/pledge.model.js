import mongoose ,{Schema} from "mongoose";
const pledgeSchema = new Schema({
    projectId:{
        type:Schema.Types.ObjectId,
        ref:"Project"
    },
    benefit_name:{
        type:String,
        required:true
    },
    benefit_description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },

}
)
export const pledge=mongoose.model('Pledge',pledgeSchema);