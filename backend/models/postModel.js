import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    likes: [],
    createdAt: {
        type: Date,
        default: new Date(),
    },
    image: String,
}, {
    timestamps: true
});

const PostModel = mongoose.model('Post', PostSchema);
export default PostModel;