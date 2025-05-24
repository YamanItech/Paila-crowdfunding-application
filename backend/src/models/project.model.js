
import mongoose, {Schema} from 'mongoose';
const projectSchema = new Schema({
    CompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },    
    Category:{
        type:String,
        required:true,
       /* future categories
        enum: [
            'Art',
            'Comics',
            'Crafts',
            'Dance',
            'Design',
            'Fashion',
            'Film',
            'Food',
            'Games',
            'Journalism',
            'Music',
            'Photography',
            'Publishing',
            'Technology',
            'Theater'
        ],

        */
        enum: [
            'Art',
            'Technology',
            'Music',
            'Publishing',
            'Games',
            'Food'
        ],
    },
    project_name:{
            type: String,
            required:true,
            trim: true,
        },
    project_description:{
            type: String,
            required:true,
            trim: true,
        },
    fund_amount:{
            type: Number,
            required:true,
        },
      pledged_amount:{
        type:Number,
        default:0
    },
    noOfBacker:{
        type: Number,
        default:0
    },
    Images: [{
            type: String, // cloudinary url
            required: true,
        }],
    start_date:{
            type: Date,
        },
    end_date:{
            type: Date,
        },
    Perk: [{
        type: Schema.Types.ObjectId,
        ref: 'Perk'
    }],
    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    },
     verified:{
      type:Boolean,
       default: false
          },


})
export const Project = mongoose.model('Project',projectSchema);
