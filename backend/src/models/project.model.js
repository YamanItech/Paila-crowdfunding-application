
import mongoose, {Schema} from 'mongoose';
const projectSchema = new Schema({
    CompanyId :{
        type:Schema.Types.ObjectId,
        ref: 'Company',
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
    current_amount:{
            type: Number,
            required:true,
        },
    start_date:{
            type: Date,
        },
    end_date:{
            type: Date,
        },
    pledge: [{
        type: Schema.Types.ObjectId,
        ref: 'Pledge'
    }]
})
export const Project = mongoose.model('Project',projectSchema);
