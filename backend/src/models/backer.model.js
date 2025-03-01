import mongoose, {Schema} from 'mongoose'
const backerSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
})
export const backer=new mongoose.model('Backer',backerSchema)