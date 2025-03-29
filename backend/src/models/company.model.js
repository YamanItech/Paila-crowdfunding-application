import mongoose, {Schema, Types} from 'mongoose'
const companySchema = new Schema({
 userId:{
     type:Schema.Types.ObjectId,
     ref:'User'
 },
 Projects:[
    {
        type:Schema.Types.ObjectId,
        ref:'Project'
    }
 ]
})
export const Company=mongoose.model('Company',companySchema);