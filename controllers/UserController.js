import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET=process.env.JWT_SECRET;
if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables");
}
export const register = async (req, res) => {
console.log("📩 Incoming register request:", req.body);
  
    try {
  const { username, email, password } = req.body;

        if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true });
        res.status(201).json({ message: "User registered successfully",user: {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email
  } });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error"});
    }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });     
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful",user: {
    _id: user._id,
    username: user.username,
    email: user.email
  } });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};  
export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
};
export const getUserProfile = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: { id: user._id, email: user.email, username: user.username } });
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
