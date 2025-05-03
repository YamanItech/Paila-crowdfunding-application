import mongoose ,{Schema} from "mongoose";
const perkSchema = new Schema({
    projectId:{
        type:Schema.Types.ObjectId,
        ref:"Project"
    },
    benefit1: [{
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }],
      benefit2: [{
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }],

      benefit3: [{
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }],

}
)
export const Perk=mongoose.model('Perk',perkSchema);