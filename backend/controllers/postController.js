import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";


// creating post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Bermasalah" });
    }
}

// get post
export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Bermasalah" });
    }
}

export const getAllPost = async (req, res) => {
    try {
        const post = await PostModel.find();
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Bermasalah" });
    }
}

// update post 
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post updated!");
        } else {
            res.status(403).json("Update Gagal");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Bermasalah" });
    }
}

// delete post
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (post.userId === userId) {
            await post.deleteOne();
            res.status(200).json("Post Deleted!");
        } else {
            res.status(403).json("Delete Gagal");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Bermasalah" });
    }
}

// like post
export const likePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(postId);
        if (post.likes.includes(userId)) {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Post unliked");
        } else {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Post liked");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Bermasalah" });
    }
}


// dapatkan postingan sendiri dan yang di follow
export const timelinePost = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUserPost = await PostModel.find({ userId: userId });

        const followingPost = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "post",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPost"
                },
            },
            {
                $project: {
                    followingPost: 1,
                    _id: 0
                }
            }
        ]);
        res.status(200).json(currentUserPost.concat(...followingPost[0].followingPost).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }));
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Bermasalah" });
    }
}