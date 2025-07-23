import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        lowercase:true,
        required: true,
        index:true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    imagePublicID: {
        type: String,
    },
    
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    timestamps: true
})

const Pin = mongoose.model("Pin", pinSchema);

export default Pin;