import UserModel from '../models/userModel.js';
// import jwt from 'jsonwebtoken';
import argon2 from 'argon2';


export const getUser = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await UserModel.findById(userId)
        if (!user) return res.status(404).json('User tidak ditemukan');

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json('Server Bermasalah');
    }
}

export const getAllUser = async (req, res) => {
    try {
        const user = await UserModel.find();
        if (!user) return res.status(404).json('User tidak ditemukan');

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json('Server Bermasalah');
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        const { username, password, confpassword } = req.body;

        let hashPassword;
        if (password === '' || password === null) {
            hashPassword = user.password
        } else {
            hashPassword = await argon2.hash(password);
        }

        if (password !== confpassword) return res.status(400).json({ msg: "Password Tidak Sesuai" });

        user.username = username;
        user.password = hashPassword;
        await user.save();
        res.status(200).json({ msg: "Berhasi Update" });
    } catch (error) {
        console.log(error);
        res.status(500).json('Server Bermasalah');
    }
}

export const forgotPassword = async (req, res) => {
    const { username, password, confpassword } = req.body;
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) return res.status(404).json('User tidak ditemukan');

        let hashPassword;
        if (password === '' || password === null) {
            hashPassword = user.password
        } else {
            hashPassword = await argon2.hash(password);
        }

        if (password !== confpassword) return res.status(400).json({ msg: "Password Tidak Sesuai" });
        user.password = hashPassword;

        await user.save();
        res.status(200).json({ msg: "Berhasi Update" });
    } catch (error) {
        console.log(error);
        res.status(500).json('Server Bermasalah');
    }
}


export const followUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    if (_id == id) {
        return res.sendStatus(403);
    } else {
        try {
            const followedUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (!followedUser.followers.includes(_id)) {
                await followedUser.updateOne({ $push: { followers: _id } });
                await followingUser.updateOne({ $push: { following: id } });

                res.status(200).json({ msg: "Berhasil Follow" });
            } else {
                res.status(403).json({ msg: "Sudah follow" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json('Server Bermasalah');
        }
    }

}


export const unfollowUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    if (_id == id) {
        return res.sendStatus(403);
    } else {
        try {
            const unfollowedUser = await UserModel.findById(id);
            const unfollowingUser = await UserModel.findById(_id);

            if (unfollowedUser.followers.includes(_id)) {
                await unfollowedUser.updateOne({ $pull: { followers: _id } });
                await unfollowingUser.updateOne({ $pull: { following: id } });

                res.status(200).json({ msg: "Berhasil Unfollow" });
            } else {
                res.status(403).json({ msg: "Kamu tidak follow" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json('Server Bermasalah');
        }
    }
}