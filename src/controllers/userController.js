import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { UserSchema } from "../models/userModels";
import "dotenv/config";

const User = mongoose.model("User", UserSchema);


export const loginRequired = (req, res, next) => {
    if (req.user) {
      return next();
    }
  
    return res.status(401).json({
      message: "Unauthorized user!",
    });
  };
  

export const register = async (req, res, next) => {

    try {
        const newUser = new User(req.body);

        newUser.hashPassword = bcrypt.hashSync(req.body.password, 10)

        const user = await newUser.save();

        const userResponse = user.toObject();
        delete userResponse.hashPassword;

        return res.status(201).json(userResponse);

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        console.log(user, "user")
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed. No user found",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Authentication failed. Wrong password",
            });
        }

        const token = jwt.sign(
            {
                email: user.email,
                username: user.username,
                _id: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
