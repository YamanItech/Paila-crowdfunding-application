import mongoose,{Schema} from 'mongoose';
const userSchema = new Schema({
    full_name: {
        type: String,
        required: true,
        trim: true,
        index:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String,
    },
},
{
    timestamps: true
}
)
export const User = mongoose.model("User", userSchema)

