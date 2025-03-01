import mongoose, {Schema} from 'mongoose'
const backerSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    contribution:[
        {
            type:Schema.Types.ObjectId,
            ref:'Contribution',
        }
    ]
})
export const backer=new mongoose.model('Backer',backerSchema)