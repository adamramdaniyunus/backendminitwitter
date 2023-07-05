import UserModel from "../models/userModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// register
export const Register = async (req, res) => {
    const { username, password, confpassword, lastname, firstname } = req.body;
    if (password !== confpassword) return res.status(400).json({ msg: "Password Tidak Sesuai" });
    const hashPassword = await argon2.hash(password);
    const newUser = new UserModel(
        {
            username,
            password: hashPassword,
            lastname,
            firstname,
            isAdmin: false
        }
    );

    try {
        const oldUser = await UserModel.findOne({ username });

        if (oldUser) return res.status(400).json({ msg: "User Sudah Digunakan" });

        const user = await newUser.save();
        const userId = user._id;
        const userName = user.username
        const token = jwt.sign({ userName, userId }, process.env.TOKEN_KEY, {
            expiresIn: "1h"
        });

        res.status(201).json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(500).json('Server Bermasalah');
    }
}

export const Login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username: username });
        if (!user) return res.status(204).json({ msg: "User tidak ditemukan" });
        if (user) {
            const match = await argon2.verify(user.password, password);
            if (!match) {
                return res.status(400).json({ msg: "Password Salah" });
            } else {
                const userId = user._id;
                const userName = user.username;
                const token = jwt.sign({ userId, userName }, process.env.TOKEN_KEY, {
                    expiresIn: '1h'
                });

                res.status(200).json({ user, token });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('Server Bermasalah');
    }
}