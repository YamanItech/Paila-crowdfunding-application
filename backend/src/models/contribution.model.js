import mongoose,{Schema} from 'mongoose'
const contributionSchema = new Schema({
    backerId:{
        type:Schema.Types.ObjectId,
        ref:'Backer'
    },
    projectId:{
        type:Schema.Types.ObjectId,
        ref:'Project'
    },
    pledgeId:{
        type:Schema.Types.ObjectId,
        ref:'Pledge'
    },
    amount:{
        type:Number,
        required:true
    },
},
{
    timestamps: true
})